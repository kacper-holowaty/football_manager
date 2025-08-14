package com.example.fcmanager.feature.achievement.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementRequestDto {

    @NotBlank(message = "Achievement name is required")
    @Size(min = 2, max = 50, message = "Achievement name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L}\\p{N} .-]*$",
            flags = Pattern.Flag.UNICODE_CASE,
            message = "Name must start with a letter and can contain letters, digits, spaces, dots or hyphens"
    )
    private String name;

    @NotNull(message = "Achievement date is required")
    @PastOrPresent(message = "Achievement date must not be in the future")
    private LocalDate date;

    @NotBlank(message = "Achievement description is required")
    @Size(min = 2, max = 500, message = "Achievement description must be between 2 and 500 characters")
    private String description;

    @NotNull(message = "Club ID is required")
    private UUID clubId;
}
