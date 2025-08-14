package com.example.fcmanager.feature.achievement.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementResponseDto {
    private UUID achievementId;
    private String name;
    private LocalDate date;
    private String description;
    private UUID clubId;
}