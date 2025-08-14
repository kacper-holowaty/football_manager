package com.example.fcmanager.feature.achievement.mapper;

import com.example.fcmanager.feature.achievement.dto.AchievementRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.fcmanager.feature.achievement.domain.Achievement;
import com.example.fcmanager.feature.achievement.dto.AchievementResponseDto;

@Mapper(componentModel = "spring")
public interface AchievementMapper {
    @Mapping(source = "club.clubId", target = "clubId")
    AchievementResponseDto toAchievementDto(Achievement achievement);

    @Mapping(target = "club", ignore = true)
    Achievement achievementRequestDtoToAchievement(AchievementRequestDto achievementRequestDto);
}