package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.PlayerDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;

public interface PlayerService {
    List<PlayerDto> getAllPlayers();
    PlayerDto getPlayerById(UUID id);
    PlayerDto savePlayer(CreatePlayerRequestDto createPlayerRequestDto);
    void deletePlayer(UUID id);
    List<PlayerDto> getPlayersByClubId(UUID clubId);
}