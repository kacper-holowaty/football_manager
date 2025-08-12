package com.example.fcmanager.service;

import com.example.fcmanager.dto.UserDto;
import com.example.fcmanager.dto.UserSaveDto;
import com.example.fcmanager.mappers.UserMapper;
import com.example.fcmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceDefault implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::userToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::userToUserDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserDto saveUser(UserSaveDto userSaveDto) {
        var user = userMapper.userSaveDtoToUser(userSaveDto);
        var savedUser = userRepository.save(user);
        return userMapper.userToUserDto(savedUser);
    }

    @Override
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
