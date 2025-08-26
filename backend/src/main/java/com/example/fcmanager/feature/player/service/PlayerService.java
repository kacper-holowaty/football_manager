package com.example.fcmanager.feature.player.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;

public interface PlayerService {
    PlayerResponseDto getPlayerById(UUID id);

    PlayerResponseDto createPlayer(UUID clubId, CreatePlayerRequestDto createPlayerRequestDto);

    PlayerResponseDto updatePlayer(UUID id, UpdatePlayerRequestDto updatePlayerRequestDto);

    void deletePlayer(UUID id);

    List<PlayerResponseDto> getPlayersByClubId(UUID clubId);

    byte[] getPlayerPhoto(UUID id);

    void removePlayerPhoto(UUID id);
}