package com.payflow.account.controller;

import com.payflow.account.dto.AccountResponse;
import com.payflow.account.dto.BalanceUpdateRequest;
import com.payflow.account.dto.CreateAccountRequest;
import com.payflow.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Account operations
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Service", description = "Manage user accounts and wallets")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Create new account", description = "Creates a new wallet account")
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable("id") Long id) {
        AccountResponse response = accountService.getAccountById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/number/{accountNumber}")
    @Operation(summary = "Get account by account number")
    public ResponseEntity<AccountResponse> getAccountByNumber(@PathVariable("accountNumber") String accountNumber) {
        AccountResponse response = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{accountNumber}/balance")
    @Operation(summary = "Get account balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable("accountNumber") String accountNumber) {
        BigDecimal balance = accountService.getBalance(accountNumber);
        return ResponseEntity.ok(balance);
    }

    @PutMapping("/balance")
    @Operation(summary = "Update account balance", description = "Debit or credit an account")
    public ResponseEntity<AccountResponse> updateBalance(@Valid @RequestBody BalanceUpdateRequest request) {
        AccountResponse response = accountService.updateBalance(request);
        return ResponseEntity.ok(response);
    }
}

