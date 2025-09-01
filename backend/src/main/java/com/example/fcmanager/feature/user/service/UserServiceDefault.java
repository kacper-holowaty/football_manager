package com.example.fcmanager.feature.user.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.UserResponseDto;
import com.example.fcmanager.feature.user.dto.UserUpdateRequestDto;
import com.example.fcmanager.feature.user.mapper.UserMapper;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.shared.exception.UserNotFoundWithIdException;

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
                .orElseThrow(() -> new UserNotFoundWithIdException(id.toString()));
    }

    @Override
    public UserResponseDto updateUser(UUID id, UserUpdateRequestDto userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundWithIdException(id.toString()));

        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());

        User updatedUser = userRepository.save(user);
        return userMapper.toUserDto(updatedUser);
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundWithIdException(id.toString());
        }
        userRepository.deleteById(id);
    }
}
