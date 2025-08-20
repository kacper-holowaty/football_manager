package com.example.fcmanager.shared.exception;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException() {
        super("Authentication token has expired.");
    }
}