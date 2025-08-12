package com.example.fcmanager.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fcmanager.dto.PlayerDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import com.example.fcmanager.service.PlayerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<PlayerDto>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getPlayerById(@PathVariable UUID id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PostMapping
    public ResponseEntity<PlayerDto> savePlayer(@RequestBody CreatePlayerRequestDto createPlayerRequestDto) {
        return new ResponseEntity<>(playerService.savePlayer(createPlayerRequestDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable UUID id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<PlayerDto>> getPlayersByClubId(@PathVariable UUID clubId) {
        return ResponseEntity.ok(playerService.getPlayersByClubId(clubId));
    }
}