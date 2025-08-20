package com.example.fcmanager.shared.exception;

public class ShirtNumberAlreadyTakenException extends RuntimeException {
    public ShirtNumberAlreadyTakenException(int shirtNumber) {
        super("Shirt number " + shirtNumber + " is already taken in this club.");
    }
}