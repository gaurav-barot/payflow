package com.payflow.account.service;

import com.payflow.account.dto.AccountResponse;
import com.payflow.account.dto.BalanceUpdateRequest;
import com.payflow.account.dto.CreateAccountRequest;
import com.payflow.account.entity.Account;
import com.payflow.account.exception.AccountNotFoundException;
import com.payflow.account.exception.DuplicateAccountException;
import com.payflow.account.exception.InsufficientBalanceException;
import com.payflow.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for account operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Create a new account
     */
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        log.info("Creating account for: {}", request.getEmail());

        // Check for duplicate email
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateAccountException("Email already registered: " + request.getEmail());
        }

        // Generate unique account number
        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .holderName(request.getHolderName())
                .email(request.getEmail())
                .balance(request.getInitialBalance())
                .build();

        Account savedAccount = accountRepository.save(account);
        log.info("Account created: {}", savedAccount.getAccountNumber());

        // Publish event to Kafka
        kafkaTemplate.send("account-created", savedAccount.getAccountNumber(), savedAccount);

        return mapToResponse(savedAccount);
    }

    /**
     * Get account by ID
     */
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + id));
        return mapToResponse(account);
    }

    /**
     * Get account by account number
     */
    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        return mapToResponse(account);
    }

    /**
     * Get all accounts
     */
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get account balance
     */
    @Transactional(readOnly = true)
    public BigDecimal getBalance(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        return account.getBalance();
    }

    /**
     * Update balance (debit or credit)
     * Uses pessimistic locking to prevent race conditions
     */
    @Transactional
    public AccountResponse updateBalance(BalanceUpdateRequest request) {
        log.info("Updating balance for account: {}, type: {}, amount: {}", 
                request.getAccountNumber(), request.getOperationType(), request.getAmount());

        // Get account with lock
        Account account = accountRepository.findByAccountNumberWithLock(request.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + request.getAccountNumber()));

        BigDecimal newBalance;
        String eventTopic;

        if (request.getOperationType() == BalanceUpdateRequest.OperationType.DEBIT) {
            // Check sufficient balance for debit
            if (account.getBalance().compareTo(request.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient balance. Available: " + account.getBalance());
            }
            newBalance = account.getBalance().subtract(request.getAmount());
            eventTopic = "debit-completed";
        } else {
            newBalance = account.getBalance().add(request.getAmount());
            eventTopic = "credit-completed";
        }

        account.setBalance(newBalance);
        Account updatedAccount = accountRepository.save(account);

        log.info("Balance updated for {}: {} -> {}", 
                account.getAccountNumber(), account.getBalance(), newBalance);

        // Publish event to Kafka
        kafkaTemplate.send(eventTopic, request.getTransactionId(), request);

        return mapToResponse(updatedAccount);
    }

    /**
     * Listen for transaction-initiated events from Transaction Service
     * Processes DEBIT or CREDIT operations and publishes completion events
     */
    @Transactional
    @KafkaListener(topics = "transaction-initiated", groupId = "account-service-group")
    public void handleTransactionRequest(Map<String, Object> event) {
        String transactionId = String.valueOf(event.get("transactionId"));
        String accountNumber = String.valueOf(event.get("accountNumber"));
        String operationType = String.valueOf(event.get("operationType"));
        BigDecimal amount = new BigDecimal(String.valueOf(event.get("amount")));

        log.info("Received transaction request: transactionId={}, account={}, type={}, amount={}",
                transactionId, accountNumber, operationType, amount);

        try {
            // Create balance update request
            BalanceUpdateRequest request = BalanceUpdateRequest.builder()
                    .transactionId(transactionId)
                    .accountNumber(accountNumber)
                    .amount(amount)
                    .operationType(
                            "DEBIT".equals(operationType)
                                    ? BalanceUpdateRequest.OperationType.DEBIT
                                    : BalanceUpdateRequest.OperationType.CREDIT
                    )
                    .build();

            // Process the balance update (this also publishes completion event)
            updateBalance(request);
            log.info("{} completed for transaction: {}", operationType, transactionId);

        } catch (Exception e) {
            log.error("Failed to process {} for transaction {}: {}", operationType, transactionId, e.getMessage());

            // Publish failure event
            Map<String, Object> failureEvent = Map.of(
                    "transactionId", transactionId,
                    "accountNumber", accountNumber,
                    "operationType", operationType,
                    "status", "FAILED",
                    "reason", e.getMessage()
            );

            kafkaTemplate.send("transaction-failed", transactionId, failureEvent);
        }
    }

    /**
     * Generate unique account number
     */
    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "ACC" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    /**
     * Map entity to response DTO
     */
    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .holderName(account.getHolderName())
                .email(account.getEmail())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}

