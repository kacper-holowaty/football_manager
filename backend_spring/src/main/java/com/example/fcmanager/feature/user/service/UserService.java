package com.example.fcmanager.feature.user.service;

import java.util.UUID;

import com.example.fcmanager.feature.user.dto.UserResponseDto;

public interface UserService {
    UserResponseDto getUserById(UUID id);
    void deleteUser(UUID id);
}
