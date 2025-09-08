package com.example.fcmanager.feature.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.ChangePasswordRequestDto;
import com.example.fcmanager.feature.user.dto.UserResponseDto;
import com.example.fcmanager.feature.user.dto.UserUpdateRequestDto;
import com.example.fcmanager.feature.user.mapper.UserMapper;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.shared.exception.InvalidOldPasswordException;
import com.example.fcmanager.shared.exception.UserNotFoundWithIdException;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceDefault userService;

    private UUID userId;
    private User user;
    private UserResponseDto userResponseDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userId = UUID.randomUUID();
        user = new User();
        user.setUserId(userId);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUsername("johndoe");
        user.setEmail("john.doe@example.com");
        user.setPassword("encodedPassword");
        userResponseDto = new UserResponseDto();
    }

    @Test
    void getUserById_userExists_returnsDto() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toUserDto(user)).thenReturn(userResponseDto);

        UserResponseDto result = userService.getUserById(userId);

        assertEquals(userResponseDto, result);
        verify(userRepository).findById(userId);
        verify(userMapper).toUserDto(user);
    }

    @Test
    void getUserById_userNotFound_throwsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundWithIdException.class, () -> userService.getUserById(userId));
        verify(userRepository).findById(userId);
    }

    @Test
    void updateUser_userExists_updatesAndReturnsDto() {
        UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");
        updateRequest.setEmail("jane.smith@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserDto(user)).thenReturn(userResponseDto);

        UserResponseDto result = userService.updateUser(userId, updateRequest);

        assertEquals(userResponseDto, result);
        assertEquals("Jane", user.getFirstName());
        assertEquals("Smith", user.getLastName());
        assertEquals("jane.smith@example.com", user.getEmail());
        verify(userRepository).findById(userId);
        verify(userRepository).save(user);
        verify(userMapper).toUserDto(user);
    }

    @Test
    void updateUser_userNotFound_throwsException() {
        UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundWithIdException.class, () -> userService.updateUser(userId, updateRequest));
        verify(userRepository).findById(userId);
    }

    @Test
    void deleteUser_userExists_deletesUser() {
        when(userRepository.existsById(userId)).thenReturn(true);

        userService.deleteUser(userId);

        verify(userRepository).existsById(userId);
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_userNotFound_throwsException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThrows(UserNotFoundWithIdException.class, () -> userService.deleteUser(userId));
        verify(userRepository).existsById(userId);
    }

    @Test
    void changePassword_userExistsAndOldPasswordMatches_changesPassword() {
        ChangePasswordRequestDto request = new ChangePasswordRequestDto();
        request.setOldPassword("oldPassword");
        request.setNewPassword("newPassword");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserDto(user)).thenReturn(userResponseDto);

        UserResponseDto result = userService.changePassword(userId, request);

        assertEquals(userResponseDto, result);
        assertEquals("newEncodedPassword", user.getPassword());
        verify(userRepository).findById(userId);
        verify(passwordEncoder).matches("oldPassword", "encodedPassword");
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(user);
        verify(userMapper).toUserDto(user);
    }

    @Test
    void changePassword_userNotFound_throwsException() {
        ChangePasswordRequestDto request = new ChangePasswordRequestDto();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundWithIdException.class, () -> userService.changePassword(userId, request));
        verify(userRepository).findById(userId);
    }

    @Test
    void changePassword_oldPasswordDoesNotMatch_throwsException() {
        ChangePasswordRequestDto request = new ChangePasswordRequestDto();
        request.setOldPassword("wrongPassword");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(InvalidOldPasswordException.class, () -> userService.changePassword(userId, request));
        verify(userRepository).findById(userId);
        verify(passwordEncoder).matches("wrongPassword", "encodedPassword");
    }
}
