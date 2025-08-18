package com.example.fcmanager.feature.player.controller;

import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import com.example.fcmanager.feature.player.service.PlayerService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/clubs/{clubId}/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<PlayerResponseDto>> getPlayersByClubId(@PathVariable UUID clubId) {
        return ResponseEntity.ok(playerService.getPlayersByClubId(clubId));
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<PlayerResponseDto> getPlayerById(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId) {
        return ResponseEntity.ok(playerService.getPlayerById(playerId));
    }

    @PostMapping
    public ResponseEntity<PlayerResponseDto> createPlayer(
            @PathVariable UUID clubId,
            @Valid @RequestBody CreatePlayerRequestDto createPlayerRequestDto)
    {
        PlayerResponseDto createdPlayer = playerService.createPlayer(clubId, createPlayerRequestDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdPlayer.getPlayerId())
                .toUri();
        return ResponseEntity.created(location).body(createdPlayer);
    }

    @PutMapping("/{playerId}")
    public ResponseEntity<PlayerResponseDto> updatePlayer(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId,
            @Valid @RequestBody UpdatePlayerRequestDto updatePlayerRequestDto)
    {
        PlayerResponseDto updatedPlayer = playerService.updatePlayer(playerId, updatePlayerRequestDto);
        return ResponseEntity.ok(updatedPlayer);
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> deletePlayer(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId)
    {
        playerService.deletePlayer(playerId);
        return ResponseEntity.noContent().build();
    }
}