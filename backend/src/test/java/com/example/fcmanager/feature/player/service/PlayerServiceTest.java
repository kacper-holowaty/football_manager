package com.example.fcmanager.feature.player.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import com.example.fcmanager.feature.player.domain.Player;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;
import com.example.fcmanager.feature.player.mapper.PlayerMapper;
import com.example.fcmanager.feature.player.repository.PlayerRepository;
import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.shared.exception.MaxPlayersLimitExceededException;
import com.example.fcmanager.shared.exception.PlayerNotFoundException;
import com.example.fcmanager.shared.exception.ShirtNumberAlreadyTakenException;

class PlayerServiceTest {

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private PlayerMapper playerMapper;

    @InjectMocks
    private PlayerServiceDefault playerService;

    private UUID playerId;
    private UUID clubId;
    private Player player;
    private Club club;
    private PlayerResponseDto playerResponseDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        playerId = UUID.randomUUID();
        clubId = UUID.randomUUID();

        club = new Club();
        club.setClubId(clubId);
        club.setName("FC Test");

        player = new Player();
        player.setPlayerId(playerId);
        player.setClub(club);
        player.setShirtNumber(10);
        player.setPhoto(new byte[]{1,2,3});

        playerResponseDto = new PlayerResponseDto();
    }

    @Test
    void getPlayerById_playerExists_returnsDto() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));
        when(playerMapper.toPlayerResponseDto(player)).thenReturn(playerResponseDto);

        PlayerResponseDto result = playerService.getPlayerById(playerId);

        assertEquals(playerResponseDto, result);
        verify(playerRepository).findById(playerId);
        verify(playerMapper).toPlayerResponseDto(player);
    }

    @Test
    void getPlayerById_playerNotFound_throwsException() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.empty());

        assertThrows(PlayerNotFoundException.class, () -> playerService.getPlayerById(playerId));
        verify(playerRepository).findById(playerId);
    }

    @Test
    void createPlayer_success_returnsDto() {
        CreatePlayerRequestDto dto = new CreatePlayerRequestDto();
        dto.setShirtNumber(5);

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(playerRepository.countByClub_ClubId(clubId)).thenReturn(5);
        when(playerRepository.existsByClub_ClubIdAndShirtNumber(clubId, 5)).thenReturn(false);
        when(playerMapper.createPlayerRequestDtoToPlayer(dto)).thenReturn(player);
        when(playerRepository.save(player)).thenReturn(player);
        when(playerMapper.toPlayerResponseDto(player)).thenReturn(playerResponseDto);

        PlayerResponseDto result = playerService.createPlayer(clubId, dto);

        assertEquals(playerResponseDto, result);
        verify(clubRepository).findById(clubId);
        verify(playerRepository).countByClub_ClubId(clubId);
        verify(playerRepository).existsByClub_ClubIdAndShirtNumber(clubId, 5);
        verify(playerRepository).save(player);
        verify(playerMapper).toPlayerResponseDto(player);
    }

    @Test
    void createPlayer_clubNotFound_throwsException() {
        CreatePlayerRequestDto dto = new CreatePlayerRequestDto();
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> playerService.createPlayer(clubId, dto));
    }

    @Test
    void createPlayer_maxPlayersExceeded_throwsException() {
        CreatePlayerRequestDto dto = new CreatePlayerRequestDto();
        dto.setShirtNumber(5);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(playerRepository.countByClub_ClubId(clubId)).thenReturn(30);

        assertThrows(MaxPlayersLimitExceededException.class, () -> playerService.createPlayer(clubId, dto));
    }

    @Test
    void createPlayer_shirtNumberTaken_throwsException() {
        CreatePlayerRequestDto dto = new CreatePlayerRequestDto();
        dto.setShirtNumber(10);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(playerRepository.countByClub_ClubId(clubId)).thenReturn(5);
        when(playerRepository.existsByClub_ClubIdAndShirtNumber(clubId, 10)).thenReturn(true);

        assertThrows(ShirtNumberAlreadyTakenException.class, () -> playerService.createPlayer(clubId, dto));
    }

    @Test
    void updatePlayer_success_updatesAndReturnsDto() {
        UpdatePlayerRequestDto dto = new UpdatePlayerRequestDto();
        dto.setShirtNumber(11);
        dto.setName("New Name");
        dto.setBirthDate(LocalDate.of(2000,1,1));
        dto.setNationality("Test");
        dto.setPositions(String.valueOf(List.of("CDM")));
        dto.setContractUntil(LocalDate.of(2025,1,1));
        dto.setSalary(1000);

        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));
        when(playerRepository.existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(clubId, 11, playerId)).thenReturn(false);
        when(playerRepository.save(player)).thenReturn(player);
        when(playerMapper.toPlayerResponseDto(player)).thenReturn(playerResponseDto);

        PlayerResponseDto result = playerService.updatePlayer(playerId, dto);

        assertEquals(playerResponseDto, result);
        assertEquals("New Name", player.getName());
        assertEquals(11, player.getShirtNumber());
        assertEquals(LocalDate.of(2000,1,1), player.getBirthDate());
        assertEquals("Test", player.getNationality());
        assertEquals(String.valueOf(List.of("CDM")), player.getPositions());
        assertEquals(LocalDate.of(2025,1,1), player.getContractUntil());
        assertEquals(1000, player.getSalary());
        verify(playerRepository).save(player);
    }

    @Test
    void updatePlayer_playerNotFound_throwsException() {
        UpdatePlayerRequestDto dto = new UpdatePlayerRequestDto();
        when(playerRepository.findById(playerId)).thenReturn(Optional.empty());

        assertThrows(PlayerNotFoundException.class, () -> playerService.updatePlayer(playerId, dto));
    }

    @Test
    void updatePlayer_shirtNumberTaken_throwsException() {
        UpdatePlayerRequestDto dto = new UpdatePlayerRequestDto();
        dto.setShirtNumber(5);

        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));
        when(playerRepository.existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(clubId, 5, playerId)).thenReturn(true);

        assertThrows(ShirtNumberAlreadyTakenException.class, () -> playerService.updatePlayer(playerId, dto));
    }

    @Test
    void deletePlayer_playerExists_deletesPlayer() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));

        playerService.deletePlayer(playerId);

        verify(playerRepository).delete(player);
    }

    @Test
    void deletePlayer_playerNotFound_throwsException() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.empty());

        assertThrows(PlayerNotFoundException.class, () -> playerService.deletePlayer(playerId));
    }

    @Test
    void getPlayersByClubId_returnsList() {
        List<Player> players = new ArrayList<>();
        players.add(player);
        when(playerRepository.findByClub_ClubId(clubId)).thenReturn(players);
        when(playerMapper.toPlayerResponseDto(player)).thenReturn(playerResponseDto);

        List<PlayerResponseDto> result = playerService.getPlayersByClubId(clubId);

        assertEquals(1, result.size());
        assertEquals(playerResponseDto, result.getFirst());
    }

    @Test
    void getPlayerPhoto_playerExists_returnsPhoto() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));

        byte[] photo = playerService.getPlayerPhoto(playerId);

        assertArrayEquals(new byte[]{1,2,3}, photo);
    }

    @Test
    void getPlayerPhoto_playerNotFound_throwsException() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.empty());

        assertThrows(PlayerNotFoundException.class, () -> playerService.getPlayerPhoto(playerId));
    }

    @Test
    void removePlayerPhoto_playerExists_setsPhotoNull() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));
        when(playerRepository.save(player)).thenReturn(player);

        playerService.removePlayerPhoto(playerId);

        assertNull(player.getPhoto());
        verify(playerRepository).save(player);
    }

    @Test
    void removePlayerPhoto_playerNotFound_throwsException() {
        when(playerRepository.findById(playerId)).thenReturn(Optional.empty());

        assertThrows(PlayerNotFoundException.class, () -> playerService.removePlayerPhoto(playerId));
    }

    @Test
    void updatePlayer_photoNotNull_setsPhoto() {
        UpdatePlayerRequestDto dto = new UpdatePlayerRequestDto();
        dto.setShirtNumber(11);
        dto.setName("New Name");
        dto.setPhoto(new byte[]{9,8,7});
        dto.setBirthDate(LocalDate.of(2000,1,1));
        dto.setNationality("Test");
        dto.setPositions(String.valueOf(List.of("CDM")));
        dto.setContractUntil(LocalDate.of(2025,1,1));
        dto.setSalary(1000);

        when(playerRepository.findById(playerId)).thenReturn(Optional.of(player));
        when(playerRepository.existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(clubId, 11, playerId)).thenReturn(false);
        when(playerRepository.save(player)).thenReturn(player);
        when(playerMapper.toPlayerResponseDto(player)).thenReturn(playerResponseDto);

        PlayerResponseDto result = playerService.updatePlayer(playerId, dto);

        assertEquals(playerResponseDto, result);
        assertArrayEquals(new byte[]{9,8,7}, player.getPhoto());
        assertEquals("New Name", player.getName());
        verify(playerRepository).save(player);
    }
}