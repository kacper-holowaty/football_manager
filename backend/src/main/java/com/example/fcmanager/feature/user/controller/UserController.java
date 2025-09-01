package com.example.fcmanager.feature.user.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fcmanager.feature.user.dto.UserResponseDto;
import com.example.fcmanager.feature.user.dto.UserUpdateRequestDto;
import com.example.fcmanager.feature.user.service.UserService;
import com.example.fcmanager.shared.dto.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable UUID id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(
            ApiResponse.success(user, "User fetched successfully")
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateRequestDto userRequest) {
        UserResponseDto updatedUser = userService.updateUser(id, userRequest);
        return ResponseEntity.ok(
            ApiResponse.success(updatedUser, "User updated successfully")
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
            ApiResponse.success(null, "User deleted successfully")
        );
    }
}