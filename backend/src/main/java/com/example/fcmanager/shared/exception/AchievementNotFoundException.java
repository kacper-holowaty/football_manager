package com.example.fcmanager.shared.exception;

public class AchievementNotFoundException extends RuntimeException {
    public AchievementNotFoundException(String id) {
        super("Achievement not found with id: " + id);
    }
}
