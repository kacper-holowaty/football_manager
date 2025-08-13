package com.example.fcmanager.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePlayerRequestDto {
    @NotBlank(message = "Player name is required")
    @Size(min = 2, max = 45, message = "Player name must be between 2 and 45 characters")
    private String name;

    @Size(max = 5242880, message = "Photo size cannot exceed 5MB")
    private byte[] photo;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotBlank(message = "Nationality is required")
    @Size(min = 2, max = 30, message = "Nationality must be between 2 and 30 characters")
    private String nationality;

    @NotBlank(message = "Position is required")
    @Pattern(regexp = "^(forward|midfielder|defender|goalkeeper)$",
            message = "Position must be one of: forward, midfielder, defender, goalkeeper")
    private String position;

    @NotNull(message = "Shirt number is required")
    @Min(value = 1, message = "Shirt number must be at least 1")
    @Max(value = 99, message = "Shirt number cannot exceed 99")
    private Integer shirtNumber;

    @NotNull(message = "Contract end date is required")
    @Future(message = "Contract must end in the future")
    private LocalDate contractUntil;

    @NotNull(message = "Salary is required")
    @Min(value = 0, message = "Salary cannot be negative")
    @Max(value = 5000000, message = "Salary cannot exceed 5 million per week")
    private Integer salary;
}
