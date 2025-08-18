package com.example.fcmanager.feature.achievement.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.feature.achievement.dto.AchievementRequestDto;
import com.example.fcmanager.feature.achievement.dto.AchievementResponseDto;

public interface AchievementService {
    List<AchievementResponseDto> getAchievementsByClubId(UUID clubId);
    AchievementResponseDto createAchievement(UUID clubId, AchievementRequestDto achievementRequestDto);
    AchievementResponseDto updateAchievement(UUID achievementId, AchievementRequestDto achievementRequestDto);
    void deleteAchievement(UUID achievementId);
}