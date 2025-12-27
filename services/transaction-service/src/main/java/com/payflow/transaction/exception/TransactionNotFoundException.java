package com.payflow.transaction.exception;

/**
 * Exception thrown when transaction is not found
 */
public class TransactionNotFoundException extends RuntimeException {
    
    public TransactionNotFoundException(String message) {
        super(message);
    }
}

