package com.example.fcmanager.feature.user.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.feature.user.dto.UserResponseDto;

public interface UserService {
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUserById(UUID id);
    void deleteUser(UUID id);
}
