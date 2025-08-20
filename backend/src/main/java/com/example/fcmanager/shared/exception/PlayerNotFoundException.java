package com.example.fcmanager.shared.exception;

public class PlayerNotFoundException extends RuntimeException {
    public PlayerNotFoundException(String id) {
        super("No player found with id: " + id);
    }
}
