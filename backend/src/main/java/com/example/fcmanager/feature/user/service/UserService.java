package com.example.fcmanager.feature.user.service;

import java.util.UUID;

import com.example.fcmanager.feature.user.dto.UserResponseDto;
import com.example.fcmanager.feature.user.dto.UserUpdateRequestDto;

public interface UserService {
    UserResponseDto getUserById(UUID id);
    UserResponseDto updateUser(UUID id, UserUpdateRequestDto userRequest);
    void deleteUser(UUID id);
}
