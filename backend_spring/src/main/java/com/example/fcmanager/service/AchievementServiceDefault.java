package com.example.fcmanager.service;

import com.example.fcmanager.domain.Achievement;
import com.example.fcmanager.domain.Club;
import com.example.fcmanager.dto.AchievementRequestDto;
import com.example.fcmanager.dto.AchievementResponseDto;
import com.example.fcmanager.mappers.AchievementMapper;
import com.example.fcmanager.repository.AchievementRepository;
import com.example.fcmanager.repository.ClubRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public AchievementResponseDto createAchievement(AchievementRequestDto achievementRequestDto) {
        Achievement achievement = achievementMapper.achievementRequestDtoToAchievement(achievementRequestDto);
        Club club = clubRepository.findById(achievementRequestDto.getClubId())
                .orElseThrow(() -> new EntityNotFoundException("No club found with id: " + achievementRequestDto.getClubId()));
        achievement.setClub(club);
        Achievement savedAchievement = achievementRepository.save(achievement);
        return achievementMapper.toAchievementDto(savedAchievement);
    }

    @Override
    @Transactional
    public AchievementResponseDto updateAchievement(UUID achievementId, AchievementRequestDto dto) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new EntityNotFoundException("Achievement not found with id: " + achievementId));

        achievement.setName(dto.getName());
        achievement.setDescription(dto.getDescription());
        achievement.setDate(dto.getDate());

        if (!achievement.getClub().getClubId().equals(dto.getClubId())) {
            Club club = clubRepository.findById(dto.getClubId())
                    .orElseThrow(() -> new EntityNotFoundException("No club found with id: " + dto.getClubId()));
            achievement.setClub(club);
        }

        Achievement updatedAchievement = achievementRepository.save(achievement);
        return achievementMapper.toAchievementDto(updatedAchievement);
    }

    @Override
    @Transactional
    public void deleteAchievement(UUID achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new EntityNotFoundException("Achievement not found with id: " + achievementId));
        achievementRepository.delete(achievement);
    }
}