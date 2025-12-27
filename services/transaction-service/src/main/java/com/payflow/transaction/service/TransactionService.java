package com.payflow.transaction.service;

import com.payflow.transaction.dto.TransactionResponse;
import com.payflow.transaction.dto.TransferRequest;
import com.payflow.transaction.entity.Transaction;
import com.payflow.transaction.entity.Transaction.TransactionStatus;
import com.payflow.transaction.exception.TransactionNotFoundException;
import com.payflow.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Service for transaction processing
 * Implements saga pattern for distributed transactions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Initiate a money transfer
     * Uses async processing with thread pool
     */
    @Transactional
    public TransactionResponse initiateTransfer(TransferRequest request) {
        log.info("Initiating transfer: {} -> {} amount: {}", 
                request.getFromAccount(), request.getToAccount(), request.getAmount());

        // Validate same account transfer
        if (request.getFromAccount().equals(request.getToAccount())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        // Create transaction record
        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        
        Transaction transaction = Transaction.builder()
                .transactionId(transactionId)
                .fromAccount(request.getFromAccount())
                .toAccount(request.getToAccount())
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Transaction created: {}", transactionId);

        // Publish event to initiate debit
        publishDebitRequest(savedTransaction);

        return mapToResponse(savedTransaction);
    }

    /**
     * Async method to publish debit request
     */
    @Async("transactionTaskExecutor")
    public CompletableFuture<Void> publishDebitRequest(Transaction transaction) {
        log.info("Publishing debit request for transaction: {}", transaction.getTransactionId());
        
        Map<String, Object> debitEvent = Map.of(
                "transactionId", transaction.getTransactionId(),
                "accountNumber", transaction.getFromAccount(),
                "amount", transaction.getAmount(),
                "operationType", "DEBIT"
        );

        kafkaTemplate.send("transaction-initiated", transaction.getTransactionId(), debitEvent);
        
        // Update status
        transaction.setStatus(TransactionStatus.DEBIT_INITIATED);
        transactionRepository.save(transaction);
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Listen for debit completion events
     */
    @KafkaListener(topics = "debit-completed", groupId = "transaction-service-group")
    public void handleDebitCompleted(Map<String, Object> event) {
        String transactionId = (String) event.get("transactionId");
        log.info("Debit completed for transaction: {}", transactionId);

        transactionRepository.findByTransactionId(transactionId).ifPresent(transaction -> {
            transaction.setStatus(TransactionStatus.DEBIT_COMPLETED);
            transactionRepository.save(transaction);
            
            // Initiate credit to receiver
            publishCreditRequest(transaction);
        });
    }

    /**
     * Publish credit request
     */
    private void publishCreditRequest(Transaction transaction) {
        log.info("Publishing credit request for transaction: {}", transaction.getTransactionId());
        
        Map<String, Object> creditEvent = Map.of(
                "transactionId", transaction.getTransactionId(),
                "accountNumber", transaction.getToAccount(),
                "amount", transaction.getAmount(),
                "operationType", "CREDIT"
        );

        kafkaTemplate.send("transaction-initiated", transaction.getTransactionId(), creditEvent);
        
        transaction.setStatus(TransactionStatus.CREDIT_INITIATED);
        transactionRepository.save(transaction);
    }

    /**
     * Listen for credit completion events
     */
    @KafkaListener(topics = "credit-completed", groupId = "transaction-service-group")
    public void handleCreditCompleted(Map<String, Object> event) {
        String transactionId = (String) event.get("transactionId");
        log.info("Credit completed for transaction: {}", transactionId);

        transactionRepository.findByTransactionId(transactionId).ifPresent(transaction -> {
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setCompletedAt(LocalDateTime.now());
            transactionRepository.save(transaction);
            
            // Publish completion notification
            kafkaTemplate.send("transaction-completed", transactionId, mapToResponse(transaction));
            log.info("Transaction completed: {}", transactionId);
        });
    }

    /**
     * Get transaction by ID
     */
    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + transactionId));
        return mapToResponse(transaction);
    }

    /**
     * Get transactions for an account
     */
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByAccount(String accountNumber) {
        return transactionRepository.findByAccountNumber(accountNumber).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all transactions
     */
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map entity to response DTO
     */
    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionId(transaction.getTransactionId())
                .fromAccount(transaction.getFromAccount())
                .toAccount(transaction.getToAccount())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .failureReason(transaction.getFailureReason())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}

