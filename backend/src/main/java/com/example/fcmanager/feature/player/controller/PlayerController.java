package com.example.fcmanager.feature.player.controller;

import com.example.fcmanager.feature.player.dto.*;
import com.example.fcmanager.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PlayerResponseDto>> createPlayer(
            @PathVariable UUID clubId,
            @Valid @ModelAttribute CreatePlayerMultipartRequestDto request
    ) {
        CreatePlayerRequestDto createPlayerRequestDto = request.toCreatePlayerRequestDto();
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

    @PutMapping(value = "/{playerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PlayerResponseDto>> updatePlayer(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId,
            @Valid @ModelAttribute UpdatePlayerMultipartRequestDto request
    ) {
        UpdatePlayerRequestDto updatePlayerRequestDto = request.toUpdatePlayerRequestDto();
        PlayerResponseDto updatedPlayer = playerService.updatePlayer(playerId, updatePlayerRequestDto);
        return ResponseEntity.ok(ApiResponse.success(updatedPlayer, "Player updated successfully"));
    }

    @GetMapping("/{playerId}/photo")
    public ResponseEntity<byte[]> getPlayerPhoto(@PathVariable UUID clubId, @PathVariable UUID playerId) {
        byte[] photo = playerService.getPlayerPhoto(playerId);

        if (photo == null || photo.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // or MediaType.IMAGE_PNG depending on your needs
        headers.setContentLength(photo.length);
        headers.setCacheControl("no-cache, no-store, must-revalidate");

        return ResponseEntity.ok()
                .headers(headers)
                .body(photo);
    }

    @DeleteMapping("/{playerId}/photo")
    public ResponseEntity<ApiResponse<Void>> removePlayerPhoto(
            @PathVariable UUID clubId,
            @PathVariable UUID playerId
    ) {
        playerService.removePlayerPhoto(playerId);
        return ResponseEntity.ok(ApiResponse.success(null, "Player photo removed successfully"));
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