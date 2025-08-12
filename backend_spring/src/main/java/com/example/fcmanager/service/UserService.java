package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.UserDto;
import com.example.fcmanager.dto.UserSaveDto;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(UUID id);
    UserDto saveUser(UserSaveDto userSaveDto);
    void deleteUser(UUID id);
}
