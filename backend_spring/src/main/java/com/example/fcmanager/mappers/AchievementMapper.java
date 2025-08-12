package com.example.fcmanager.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.example.fcmanager.domain.Achievement;
import com.example.fcmanager.dto.AchievementDto;

@Mapper(componentModel = "spring")
public interface AchievementMapper {

    AchievementMapper INSTANCE = Mappers.getMapper(AchievementMapper.class);

    @Mapping(source = "club.clubId", target = "clubId")
    AchievementDto achievementToAchievementDto(Achievement achievement);

    @Mapping(target = "club", ignore = true)
    Achievement achievementDtoToAchievement(AchievementDto achievementDto);
}