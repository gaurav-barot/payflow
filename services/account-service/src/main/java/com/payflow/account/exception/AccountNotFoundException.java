package com.payflow.account.exception;

/**
 * Exception thrown when account is not found
 */
public class AccountNotFoundException extends RuntimeException {
    
    public AccountNotFoundException(String message) {
        super(message);
    }
}

