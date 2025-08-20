package com.example.fcmanager.shared.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String login) {
        super("User '" + login + "' not found.");
    }
}
