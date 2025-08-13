package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.AchievementRequestDto;
import com.example.fcmanager.dto.AchievementResponseDto;

public interface AchievementService {
    List<AchievementResponseDto> getAchievementsByClubId(UUID clubId);
    AchievementResponseDto createAchievement(AchievementRequestDto achievementRequestDto);
    AchievementResponseDto updateAchievement(UUID achievementId, AchievementRequestDto achievementRequestDto);
    void deleteAchievement(UUID achievementId);
}