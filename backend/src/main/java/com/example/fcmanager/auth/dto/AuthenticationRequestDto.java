package com.example.fcmanager.auth.dto;

import com.example.fcmanager.shared.validators.ValidLoginField;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ValidLoginField
public class AuthenticationRequestDto {

    @NotBlank(message = "Login field is required")
    private String login;

    @NotBlank(message = "Password is required")
    private String password;
}