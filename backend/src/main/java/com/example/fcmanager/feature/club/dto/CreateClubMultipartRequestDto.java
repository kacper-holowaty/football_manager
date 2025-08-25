package com.example.fcmanager.feature.club.dto;

import com.example.fcmanager.feature.address.dto.AddressRequestDto;
import com.example.fcmanager.shared.exception.FileProcessingException;
import com.example.fcmanager.shared.validators.FoundedYear;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateClubMultipartRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L}\\p{N} .-]*$",
            message = "Name must start with a letter and can contain letters, digits, spaces, dots, or hyphens"
    )
    private String name;

    private MultipartFile badge;

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


    @NotBlank(message = "Street is required")
    @Size(min = 3, max = 32, message = "Street must be between 3 and 32 characters")
    @Pattern(
            regexp = "^[\\p{L}\\p{N}][\\p{L}\\p{N} .-]*$",
            flags = Pattern.Flag.UNICODE_CASE,
            message = "Street contains invalid characters"
    )
    private String addressStreet;

    @NotBlank(message = "House number is required")
    @Size(max = 6, message = "House number must be at most 6 characters")
    @Pattern(
            regexp = "^[1-9]\\d{0,4}[a-zA-Z]?$",
            message = "Invalid house number format"
    )
    private String addressHouseNumber;

    @Pattern(
            regexp = "^[1-9]\\d{0,4}$",
            message = "Apartment number must be between 1 and 99999 and contain only digits"
    )
    private String addressApartmentNumber;

    @NotBlank(message = "Postal code is required")
    @Size(min = 4, max = 6, message = "Postal code must be between 4 and 6 characters")
    @Pattern(
            regexp = "^[A-Z\\d-]{4,6}$",
            message = "Invalid postal code format"
    )
    private String addressPostalCode;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 32, message = "City must be between 2 and 32 characters")
    @Pattern(
            regexp = "^[\\p{Lu}][\\p{L}\\p{M}\\p{Lu}]*([ -][\\p{L}\\p{M}\\p{Lu}]+)*$",
            flags = Pattern.Flag.UNICODE_CASE,
            message = "City must start with a capital letter and contain only letters, spaces or hyphens"
    )
    private String addressCity;

    @NotBlank(message = "Country is required")
    @Size(min = 3, max = 40, message = "Country must be between 3 and 40 characters")
    private String addressCountry;

    @NotNull(message = "Owner ID is required")
    private UUID ownerId;

    public CreateClubRequestDto toCreateClubRequestDto() {
        byte[] badgeBytes = null;
        if (badge != null && !badge.isEmpty()) {
            try {
                badgeBytes = badge.getBytes();
            } catch (IOException e) {
                throw new FileProcessingException("Failed to process badge file", e);
            }
        }

        return CreateClubRequestDto.builder()
                .name(this.name)
                .badge(badgeBytes)
                .foundedYear(this.foundedYear)
                .stadiumName(this.stadiumName)
                .stadiumCapacity(this.stadiumCapacity)
                .address(AddressRequestDto.builder()
                        .street(this.addressStreet)
                        .houseNumber(this.addressHouseNumber)
                        .apartmentNumber(this.addressApartmentNumber)
                        .postalCode(this.addressPostalCode)
                        .city(this.addressCity)
                        .country(this.addressCountry)
                        .build())
                .ownerId(this.ownerId)
                .build();
    }
}