package com.example.fcmanager.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerResponseDto {
    private UUID playerId;
    private String name;
    private byte[] photo;
    private LocalDate birthDate;
    private String nationality;
    private String position;
    private int shirtNumber;
    private LocalDate contractUntil;
    private int salary;
    private UUID clubId;
}