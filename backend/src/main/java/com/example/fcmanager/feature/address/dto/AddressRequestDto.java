package com.example.fcmanager.feature.address.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequestDto {
    @NotBlank(message = "Street is required")
    @Size(min = 3, max = 32, message = "Street must be between 3 and 32 characters")
    @Pattern(
            regexp = "^[\\p{L}\\p{N}][\\p{L}\\p{N} .-]*$",
            flags = Pattern.Flag.UNICODE_CASE,
            message = "Street contains invalid characters"
    )
    private String street;

    @NotBlank(message = "House number is required")
    @Size(max = 6, message = "House number must be at most 6 characters")
    @Pattern(
            regexp = "^[1-9]\\d{0,4}[a-zA-Z]?$",
            message = "Invalid house number format"
    )
    private String houseNumber;

    @Pattern(
            regexp = "^[1-9]\\d{0,4}$",
            message = "Apartment number must be between 1 and 99999 and contain only digits"
    )
    private String apartmentNumber;

    @NotBlank(message = "Postal code is required")
    @Size(min = 4, max = 6, message = "Postal code must be between 4 and 6 characters")
    @Pattern(
            regexp = "^[A-Z\\d-]{4,6}$",
            message = "Invalid postal code format"
    )
    private String postalCode;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 32, message = "City must be between 2 and 32 characters")
    @Pattern(
            regexp = "^[\\p{Lu}][\\p{L}\\p{M}\\p{Lu}]*([ -][\\p{L}\\p{M}\\p{Lu}]+)*$",
            flags = Pattern.Flag.UNICODE_CASE,
            message = "City must start with a capital letter and contain only letters, spaces or hyphens"
    )
    private String city;

    @NotBlank(message = "Country is required")
    @Size(min = 3, max = 40, message = "Country must be between 3 and 40 characters")
    private String country;
}
