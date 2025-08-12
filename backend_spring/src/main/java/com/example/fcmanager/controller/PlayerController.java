package com.example.fcmanager.controller;

import com.example.fcmanager.dto.UpdatePlayerRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fcmanager.dto.PlayerResponseDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import com.example.fcmanager.service.PlayerService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<PlayerResponseDto>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerResponseDto> getPlayerById(@PathVariable UUID id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PostMapping
    public ResponseEntity<PlayerResponseDto> createPlayer(@RequestBody CreatePlayerRequestDto createPlayerRequestDto) {
        PlayerResponseDto createdPlayer = playerService.createPlayer(createPlayerRequestDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdPlayer.getPlayerId())
                .toUri();
        return ResponseEntity.created(location).body(createdPlayer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerResponseDto> updatePlayer(
            @PathVariable UUID id,
            @RequestBody UpdatePlayerRequestDto updatePlayerRequestDto) {

        PlayerResponseDto updatedPlayer = playerService.updatePlayer(id, updatePlayerRequestDto);
        return ResponseEntity.ok(updatedPlayer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable UUID id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<PlayerResponseDto>> getPlayersByClubId(@PathVariable UUID clubId) {
        return ResponseEntity.ok(playerService.getPlayersByClubId(clubId));
    }
}