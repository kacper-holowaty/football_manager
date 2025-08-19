package com.example.fcmanager.feature.user.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.fcmanager.exception.UserNotFoundWithIdException;
import com.example.fcmanager.feature.user.dto.UserResponseDto;
import com.example.fcmanager.feature.user.mapper.UserMapper;
import com.example.fcmanager.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceDefault implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toUserDto)
                .orElseThrow(() -> new UserNotFoundWithIdException("User not found with id: " + id));
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundWithIdException("Cannot delete. User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
