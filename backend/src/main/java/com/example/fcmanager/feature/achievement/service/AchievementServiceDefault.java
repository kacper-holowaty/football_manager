package com.example.fcmanager.feature.achievement.service;

import com.example.fcmanager.shared.exception.AchievementNotFoundException;
import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.feature.achievement.domain.Achievement;
import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.achievement.dto.AchievementRequestDto;
import com.example.fcmanager.feature.achievement.dto.AchievementResponseDto;
import com.example.fcmanager.feature.achievement.mapper.AchievementMapper;
import com.example.fcmanager.feature.achievement.repository.AchievementRepository;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementServiceDefault implements AchievementService {

    private final AchievementRepository achievementRepository;
    private final ClubRepository clubRepository;
    private final AchievementMapper achievementMapper;

    @Override
    public List<AchievementResponseDto> getAchievementsByClubId(UUID clubId) {
        return achievementRepository.findByClub_ClubId(clubId).stream()
                .map(achievementMapper::toAchievementDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AchievementResponseDto createAchievement(UUID clubId, AchievementRequestDto achievementRequestDto) {
        Achievement achievement = achievementMapper.achievementRequestDtoToAchievement(achievementRequestDto);
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId.toString()));
        achievement.setClub(club);
        Achievement savedAchievement = achievementRepository.save(achievement);
        return achievementMapper.toAchievementDto(savedAchievement);
    }

    @Override
    @Transactional
    public AchievementResponseDto updateAchievement(UUID achievementId, AchievementRequestDto dto) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new AchievementNotFoundException(achievementId.toString()));

        achievement.setName(dto.getName());
        achievement.setDescription(dto.getDescription());
        achievement.setDate(dto.getDate());

        Achievement updatedAchievement = achievementRepository.save(achievement);
        return achievementMapper.toAchievementDto(updatedAchievement);
    }

    @Override
    @Transactional
    public void deleteAchievement(UUID achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new AchievementNotFoundException(achievementId.toString()));
        achievementRepository.delete(achievement);
    }
}