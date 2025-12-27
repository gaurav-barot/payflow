package com.payflow.account.exception;

/**
 * Exception thrown when duplicate account is detected
 */
public class DuplicateAccountException extends RuntimeException {
    
    public DuplicateAccountException(String message) {
        super(message);
    }
}

