package com.example.fcmanager.shared.exception;

public class UserClubLimitExceededException extends RuntimeException {
    private static final int MAX_CLUBS_PER_USER = 4;

    public UserClubLimitExceededException(String username) {
        super(String.format("User %s has reached the maximum limit of %d clubs.",
                username, MAX_CLUBS_PER_USER));
    }
}