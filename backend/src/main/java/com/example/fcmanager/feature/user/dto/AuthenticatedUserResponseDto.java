package com.example.fcmanager.feature.user.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponseDto {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
}
