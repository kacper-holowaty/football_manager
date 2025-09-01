package com.example.fcmanager.feature.user.dto;

import java.util.UUID;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
}