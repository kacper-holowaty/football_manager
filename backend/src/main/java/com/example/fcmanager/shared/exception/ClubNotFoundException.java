package com.example.fcmanager.shared.exception;

public class ClubNotFoundException extends RuntimeException {
    public ClubNotFoundException(String id) {
        super("Club not found with id: " + id);
    }
}