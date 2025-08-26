package com.example.fcmanager.shared.exception;

public class FileProcessingException extends RuntimeException {
    public FileProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}