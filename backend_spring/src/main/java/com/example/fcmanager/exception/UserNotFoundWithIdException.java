package com.example.fcmanager.exception;

public class UserNotFoundWithIdException extends RuntimeException {
    public UserNotFoundWithIdException(String id) {
        super("User with id'" + id + "' not found.");
    }
}