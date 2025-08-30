package com.example.fcmanager.shared.exception;

public class InvalidAchievementDateException extends RuntimeException {
    public InvalidAchievementDateException(int achievementYear, int foundedYear) {
        super("Achievement date (" + achievementYear + ") cannot be before club's founded year (" + foundedYear + ").");
    }
}