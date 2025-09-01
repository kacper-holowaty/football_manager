package com.example.fcmanager.feature.user.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequestDto {
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 40, message = "First name must be between 2 and 40 characters")
    @Pattern(
            regexp = "^\\p{Lu}[\\p{L}\\- ]*\\p{L}$",
            message = "First name must start with a capital letter, contain only letters, spaces or '-', and not end with space or '-'"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 40, message = "Last name must be between 2 and 40 characters")
    @Pattern(
            regexp = "^(?![ \\-])[\\p{L}\\- ]*\\p{L}$",
            message = "Last name cannot start with space or '-', must contain only letters, spaces or '-', and cannot end with space or '-'"
    )
    private String lastName;


    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
}