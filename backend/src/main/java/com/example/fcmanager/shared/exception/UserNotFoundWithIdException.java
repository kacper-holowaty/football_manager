package com.example.fcmanager.shared.exception;

public class UserNotFoundWithIdException extends RuntimeException {
    public UserNotFoundWithIdException(String id) {
        super("User not found with id: " + id);
    }
}