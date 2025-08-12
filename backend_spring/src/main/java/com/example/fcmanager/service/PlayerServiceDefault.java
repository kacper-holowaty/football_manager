package com.example.fcmanager.service;

import com.example.fcmanager.dto.PlayerDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import com.example.fcmanager.mappers.PlayerMapper;
import com.example.fcmanager.repository.ClubRepository;
import com.example.fcmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerServiceDefault implements PlayerService {

    private final PlayerRepository playerRepository;
    private final ClubRepository clubRepository;
    private final PlayerMapper playerMapper;

    @Override
    public List<PlayerDto> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(playerMapper::playerToPlayerDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDto getPlayerById(UUID id) {
        return playerRepository.findById(id)
                .map(playerMapper::playerToPlayerDto)
                .orElseThrow(() -> new RuntimeException("Player not found"));
    }

    @Override
    public PlayerDto savePlayer(CreatePlayerRequestDto createPlayerRequestDto) {
        var player = playerMapper.playerSaveDtoToPlayer(createPlayerRequestDto);
        var club = clubRepository.findById(createPlayerRequestDto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));
        player.setClub(club);
        var savedPlayer = playerRepository.save(player);
        return playerMapper.playerToPlayerDto(savedPlayer);
    }

    @Override
    public void deletePlayer(UUID id) {
        playerRepository.deleteById(id);
    }

    @Override
    public List<PlayerDto> getPlayersByClubId(UUID clubId) {
        return playerRepository.findByClubId(clubId).stream()
                .map(playerMapper::playerToPlayerDto)
                .collect(Collectors.toList());
    }
}