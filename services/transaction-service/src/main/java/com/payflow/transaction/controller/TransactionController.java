package com.payflow.transaction.controller;

import com.payflow.transaction.dto.TransactionResponse;
import com.payflow.transaction.dto.TransferRequest;
import com.payflow.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Transaction operations
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Service", description = "Process money transfers")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Initiate money transfer", description = "Transfer money from one account to another")
    public ResponseEntity<TransactionResponse> initiateTransfer(@Valid @RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.initiateTransfer(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @GetMapping("/{transactionId}")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable("transactionId") String transactionId) {
        TransactionResponse response = transactionService.getTransaction(transactionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/account/{accountNumber}")
    @Operation(summary = "Get transactions for an account")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(@PathVariable("accountNumber") String accountNumber) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByAccount(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    @Operation(summary = "Get all transactions")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
}

