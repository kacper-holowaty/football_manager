package com.example.fcmanager.exception;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException() {
        super("Authentication token has expired.");
    }
}