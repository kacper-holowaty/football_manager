package com.example.fcmanager.feature.player.controller;

import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;
import com.example.fcmanager.shared.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<PlayerResponseDto>>> getPlayersByClubId(@PathVariable UUID clubId) {
        List<PlayerResponseDto> players = playerService.getPlayersByClubId(clubId);
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<ApiResponse<PlayerResponseDto>> getPlayerById(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId
    ) {
        PlayerResponseDto player = playerService.getPlayerById(playerId);
        return ResponseEntity.ok(ApiResponse.success(player));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlayerResponseDto>> createPlayer(
            @PathVariable UUID clubId,
            @Valid @RequestBody CreatePlayerRequestDto createPlayerRequestDto
    ) {
        PlayerResponseDto createdPlayer = playerService.createPlayer(clubId, createPlayerRequestDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdPlayer.getPlayerId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created(createdPlayer, "Player created successfully"));
    }

    @PutMapping("/{playerId}")
    public ResponseEntity<ApiResponse<PlayerResponseDto>> updatePlayer(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId,
            @Valid @RequestBody UpdatePlayerRequestDto updatePlayerRequestDto
    ) {
        PlayerResponseDto updatedPlayer = playerService.updatePlayer(playerId, updatePlayerRequestDto);
        return ResponseEntity.ok(ApiResponse.success(updatedPlayer, "Player updated successfully"));
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId
    ) {
        playerService.deletePlayer(playerId);
        return ResponseEntity.ok(ApiResponse.success(null, "Player deleted successfully"));
    }
}