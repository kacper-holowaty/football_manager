package com.example.fcmanager.shared.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username, String email) {
        super("User with username: '" + username + "' or email: '" + email + "' already exists.");
    }
}
