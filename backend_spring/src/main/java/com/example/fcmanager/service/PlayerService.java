package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.PlayerResponseDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import com.example.fcmanager.dto.UpdatePlayerRequestDto;

public interface PlayerService {
    List<PlayerResponseDto> getAllPlayers();
    PlayerResponseDto getPlayerById(UUID id);
    PlayerResponseDto createPlayer(CreatePlayerRequestDto createPlayerRequestDto);
    PlayerResponseDto updatePlayer(UUID id, UpdatePlayerRequestDto updatePlayerRequestDto);
    void deletePlayer(UUID id);
    List<PlayerResponseDto> getPlayersByClubId(UUID clubId);
}