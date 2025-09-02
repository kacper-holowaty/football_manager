package com.example.fcmanager.feature.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequestDto {

    @NotBlank(message = "Old password cannot be empty.")
    private String oldPassword;

    @NotBlank(message = "New password cannot be empty.")
    @Size(min = 8, message = "New password must have at least 8 characters.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,}$",
            message = "New password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*_)."
    )
    private String newPassword;
}