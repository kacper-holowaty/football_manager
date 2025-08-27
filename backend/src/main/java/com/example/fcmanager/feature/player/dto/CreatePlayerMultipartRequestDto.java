package com.example.fcmanager.feature.player.dto;

import com.example.fcmanager.shared.exception.FileProcessingException;
import lombok.*;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePlayerMultipartRequestDto {

    @NotBlank(message = "Player name is required")
    @Size(min = 2, max = 45, message = "Player name must be between 2 and 45 characters")
    private String name;

    private MultipartFile photo;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotBlank(message = "Nationality is required")
    @Size(min = 2, max = 30, message = "Nationality must be between 2 and 30 characters")
    private String nationality;

    @NotEmpty(message = "At least one positions is required")
    @Size(max = 3, message = "Maximum 3 positions allowed")
    private String[] positions;

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

    @AssertTrue(message = "All positions must be valid")
    private boolean isValidPositions() {
        if (positions == null) {
            return false;
        }

        Set<String> validPositions = Set.of("GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "CF", "ST");

        for (String pos : positions) {
            if (pos == null || pos.trim().isEmpty() || !validPositions.contains(pos.trim().toUpperCase())) {
                return false;
            }
        }

        Set<String> uniquePositions = new HashSet<>();
        for (String pos : positions) {
            if (!uniquePositions.add(pos.trim().toUpperCase())) {
                return false;
            }
        }

        return true;
    }

    public CreatePlayerRequestDto toCreatePlayerRequestDto() {
        byte[] photoBytes = null;
        if (photo != null && !photo.isEmpty()) {
            try {
                photoBytes = photo.getBytes();
            } catch (IOException e) {
                throw new FileProcessingException("Failed to process photo file", e);
            }
        }

        String positionsString = null;
        if (positions != null && positions.length > 0) {
            positionsString = Arrays.stream(positions)
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .distinct()
                    .collect(Collectors.joining(","));
        }

        return CreatePlayerRequestDto.builder()
                .name(this.name)
                .photo(photoBytes)
                .birthDate(this.birthDate)
                .nationality(this.nationality)
                .positions(positionsString)
                .shirtNumber(this.shirtNumber)
                .contractUntil(this.contractUntil)
                .salary(this.salary)
                .build();
    }
}