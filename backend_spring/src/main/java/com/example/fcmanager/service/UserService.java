package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.UserResponseDto;
import com.example.fcmanager.dto.UserSaveDto;

public interface UserService {
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUserById(UUID id);
    UserResponseDto saveUser(UserSaveDto userSaveDto);
    void deleteUser(UUID id);
}
