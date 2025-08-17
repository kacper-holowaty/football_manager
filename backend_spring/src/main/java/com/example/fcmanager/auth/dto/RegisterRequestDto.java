package com.example.fcmanager.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 40, message = "First name must be between 2 and 40 characters")
    @Pattern(
            regexp = "^[\\p{Lu}][\\p{L}\\- ]*[\\p{L}]$",
            message = "First name must start with a capital letter, contain only letters, spaces or '-', and not end with space or '-'"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 40, message = "Last name must be between 2 and 40 characters")
    @Pattern(
            regexp = "^(?![ \\-])[\\p{L}\\- ]*[\\p{L}]$",
            message = "Last name cannot start with space or '-', must contain only letters, spaces or '-', and cannot end with space or '-'"
    )
    private String lastName;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(
            regexp = "^[A-Za-z][A-Za-z0-9_]{2,29}$",
            message = "Username must contain at least two letters, cannot include certain special characters, and must not start or end with spaces"
    )
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password cannot be empty.")
    @Size(min = 8, message = "Password must have at least 8 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,}$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*_)."
    )
    private String password;
}
