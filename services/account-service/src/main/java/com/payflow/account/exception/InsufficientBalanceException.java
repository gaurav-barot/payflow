package com.payflow.account.exception;

/**
 * Exception thrown when account has insufficient balance
 */
public class InsufficientBalanceException extends RuntimeException {
    
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

