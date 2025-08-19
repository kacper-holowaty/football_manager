package com.example.fcmanager.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username, String email) {
        super("User with username '" + username + "' or email '" + email + "' already exists.");
    }
}
