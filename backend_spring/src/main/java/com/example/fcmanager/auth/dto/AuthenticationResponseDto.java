package com.example.fcmanager.auth.dto;

import com.example.fcmanager.feature.user.dto.AuthenticatedUserResponseDto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponseDto {
    private String accessToken;
    private String refreshToken;
    private AuthenticatedUserResponseDto user;
}
