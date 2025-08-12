package com.example.fcmanager.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubDto {
    private UUID clubId;
    private String name;
    private byte[] badge;
    private int foundedYear;
    private String stadiumName;
    private int stadiumCapacity;
    private UUID userId;
    private AddressDto address;
    private List<PlayerDto> players;
    private List<AchievementDto> achievements;
}