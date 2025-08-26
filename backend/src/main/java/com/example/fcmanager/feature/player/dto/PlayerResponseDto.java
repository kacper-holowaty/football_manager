package com.example.fcmanager.feature.player.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerResponseDto {
    private UUID playerId;
    private String name;
    private boolean hasPhoto;
    private LocalDate birthDate;
    private String nationality;
    private List<String> positions;
    private Integer shirtNumber;
    private LocalDate contractUntil;
    private Integer salary;
    private UUID clubId;
}