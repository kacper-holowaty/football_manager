package com.example.fcmanager.exception;

public class ClubAlreadyExistsException extends RuntimeException {
    public ClubAlreadyExistsException(String name) {
        super("Club with name '" + name + "' already exists.");
    }
}
