package com.example.fcmanager.feature.achievement.service;

import com.example.fcmanager.feature.achievement.domain.Achievement;
import com.example.fcmanager.feature.achievement.dto.AchievementRequestDto;
import com.example.fcmanager.feature.achievement.dto.AchievementResponseDto;
import com.example.fcmanager.feature.achievement.mapper.AchievementMapper;
import com.example.fcmanager.feature.achievement.repository.AchievementRepository;
import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import com.example.fcmanager.shared.exception.AchievementNotFoundException;
import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.shared.exception.InvalidAchievementDateException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AchievementServiceTest {

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private AchievementMapper achievementMapper;

    @InjectMocks
    private AchievementServiceDefault achievementService;

    private UUID clubId;
    private UUID achievementId;
    private Club club;
    private Achievement achievement;
    private AchievementRequestDto requestDto;
    private AchievementResponseDto responseDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        clubId = UUID.randomUUID();
        achievementId = UUID.randomUUID();
        club = new Club();
        club.setClubId(clubId);
        club.setFoundedYear(2000);

        achievement = new Achievement();
        achievement.setAchievementId(achievementId);
        achievement.setClub(club);
        achievement.setName("Championship");
        achievement.setDescription("Won the league");
        achievement.setDate(LocalDate.of(2020, 1, 1));

        requestDto = new AchievementRequestDto();
        requestDto.setName("New Trophy");
        requestDto.setDescription("Final victory");
        requestDto.setDate(LocalDate.of(2021, 5, 10));

        responseDto = new AchievementResponseDto();
        responseDto.setAchievementId(achievementId);
        responseDto.setName("Response DTO");
    }

    @Test
    void shouldReturnAchievementsByClubId() {
        when(achievementRepository.findByClub_ClubId(clubId)).thenReturn(List.of(achievement));
        when(achievementMapper.toAchievementDto(achievement)).thenReturn(responseDto);

        List<AchievementResponseDto> result = achievementService.getAchievementsByClubId(clubId);

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getAchievementId()).isEqualTo(achievementId);
        verify(achievementRepository).findByClub_ClubId(clubId);
        verify(achievementMapper).toAchievementDto(achievement);
    }

    @Test
    void shouldCreateAchievementSuccessfully() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(achievementMapper.achievementRequestDtoToAchievement(requestDto)).thenReturn(achievement);
        when(achievementRepository.save(achievement)).thenReturn(achievement);
        when(achievementMapper.toAchievementDto(achievement)).thenReturn(responseDto);

        AchievementResponseDto result = achievementService.createAchievement(clubId, requestDto);

        assertThat(result).isEqualTo(responseDto);
        verify(clubRepository).findById(clubId);
        verify(achievementMapper).achievementRequestDtoToAchievement(requestDto);
        verify(achievementRepository).save(achievement);
    }

    @Test
    void shouldThrowExceptionWhenClubNotFoundOnCreate() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());
        assertThrows(ClubNotFoundException.class,
                () -> achievementService.createAchievement(clubId, requestDto));
        verify(clubRepository).findById(clubId);
    }

    @Test
    void shouldThrowInvalidAchievementDateExceptionOnCreate() {
        requestDto.setDate(LocalDate.of(1995, 1, 1));
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        assertThrows(InvalidAchievementDateException.class,
                () -> achievementService.createAchievement(clubId, requestDto));
        verify(clubRepository).findById(clubId);
    }

    @Test
    void shouldUpdateAchievementSuccessfully() {
        when(achievementRepository.findById(achievementId)).thenReturn(Optional.of(achievement));
        when(achievementRepository.save(achievement)).thenReturn(achievement);
        when(achievementMapper.toAchievementDto(achievement)).thenReturn(responseDto);

        AchievementResponseDto result = achievementService.updateAchievement(achievementId, requestDto);

        assertThat(result).isEqualTo(responseDto);
        assertThat(achievement.getName()).isEqualTo(requestDto.getName());
        assertThat(achievement.getDescription()).isEqualTo(requestDto.getDescription());
        assertThat(achievement.getDate()).isEqualTo(requestDto.getDate());
        verify(achievementRepository).findById(achievementId);
        verify(achievementRepository).save(achievement);
        verify(achievementMapper).toAchievementDto(achievement);
    }

    @Test
    void shouldThrowExceptionWhenAchievementNotFoundOnUpdate() {
        when(achievementRepository.findById(achievementId)).thenReturn(Optional.empty());
        assertThrows(AchievementNotFoundException.class,
                () -> achievementService.updateAchievement(achievementId, requestDto));
        verify(achievementRepository).findById(achievementId);
    }

    @Test
    void shouldThrowInvalidAchievementDateExceptionOnUpdate() {
        requestDto.setDate(LocalDate.of(1990, 1, 1));
        when(achievementRepository.findById(achievementId)).thenReturn(Optional.of(achievement));
        assertThrows(InvalidAchievementDateException.class,
                () -> achievementService.updateAchievement(achievementId, requestDto));
        verify(achievementRepository).findById(achievementId);
    }

    @Test
    void shouldDeleteAchievementSuccessfully() {
        when(achievementRepository.findById(achievementId)).thenReturn(Optional.of(achievement));
        doNothing().when(achievementRepository).delete(achievement);

        achievementService.deleteAchievement(achievementId);

        verify(achievementRepository).findById(achievementId);
        verify(achievementRepository).delete(achievement);
    }

    @Test
    void shouldThrowExceptionWhenAchievementNotFoundOnDelete() {
        when(achievementRepository.findById(achievementId)).thenReturn(Optional.empty());
        assertThrows(AchievementNotFoundException.class,
                () -> achievementService.deleteAchievement(achievementId));
        verify(achievementRepository).findById(achievementId);
    }

    @Test
    void shouldNotThrowWhenFoundedYearIsNull() {
        club.setFoundedYear(null);
        requestDto.setDate(LocalDate.of(2020, 1, 1));
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(achievementMapper.achievementRequestDtoToAchievement(requestDto)).thenReturn(achievement);
        when(achievementRepository.save(achievement)).thenReturn(achievement);
        when(achievementMapper.toAchievementDto(achievement)).thenReturn(responseDto);

        AchievementResponseDto result = achievementService.createAchievement(clubId, requestDto);

        assertThat(result).isEqualTo(responseDto);
    }

    @Test
    void shouldNotThrowWhenAchievementDateIsNull() {
        requestDto.setDate(null);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(achievementMapper.achievementRequestDtoToAchievement(requestDto)).thenReturn(achievement);
        when(achievementRepository.save(achievement)).thenReturn(achievement);
        when(achievementMapper.toAchievementDto(achievement)).thenReturn(responseDto);

        AchievementResponseDto result = achievementService.createAchievement(clubId, requestDto);

        assertThat(result).isEqualTo(responseDto);
    }
}
