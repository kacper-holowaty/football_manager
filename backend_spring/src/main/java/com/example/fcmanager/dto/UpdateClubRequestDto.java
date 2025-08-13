package com.example.fcmanager.dto;

import com.example.fcmanager.validators.FoundedYear;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateClubRequestDto {
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L}\\p{N} .-]*$",
            message = "Name must start with a letter and can contain letters, digits, spaces, dots, or hyphens"
    )
    private String name;

    private byte[] badge;

    @NotNull(message = "Club founded year is required")
    @FoundedYear
    private Integer foundedYear;

    @NotBlank(message = "Stadium name is required")
    @Size(min = 3, max = 32, message = "Stadium name must be between 3 and 32 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L}\\p{N} .-]*$",
            message = "Stadium name must start with a letter and can contain letters, digits, spaces, dots, or hyphens"
    )
    private String stadiumName;

    @NotNull(message = "Stadium capacity is required")
    @Min(value = 0, message = "Stadium capacity must be at least 0")
    @Max(value = 250000, message = "Stadium capacity must be at most 250000")
    private Integer stadiumCapacity;

    @Valid
    private AddressRequestDto address;
}
