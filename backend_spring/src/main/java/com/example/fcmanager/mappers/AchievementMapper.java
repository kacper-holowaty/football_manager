package com.example.fcmanager.mappers;

import com.example.fcmanager.dto.AchievementRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.fcmanager.domain.Achievement;
import com.example.fcmanager.dto.AchievementResponseDto;

@Mapper(componentModel = "spring")
public interface AchievementMapper {
    @Mapping(source = "club.clubId", target = "clubId")
    AchievementResponseDto toAchievementDto(Achievement achievement);

    @Mapping(target = "club", ignore = true)
    Achievement achievementRequestDtoToAchievement(AchievementRequestDto achievementRequestDto);
}