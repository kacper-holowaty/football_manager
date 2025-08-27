package com.example.fcmanager.shared.exception;

public class MaxPlayersLimitExceededException extends RuntimeException {
    private static final int MAX_PLAYERS_LIMIT = 30;

    public MaxPlayersLimitExceededException(String clubName) {
        super(String.format("Club with name '%s' exceeded maximum number of %d players.",
                clubName, MAX_PLAYERS_LIMIT));
    }
}
