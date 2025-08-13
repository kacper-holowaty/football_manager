package com.example.fcmanager.controller;

import com.example.fcmanager.dto.AchievementRequestDto;
import com.example.fcmanager.dto.AchievementResponseDto;
import com.example.fcmanager.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubs/{clubId}/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementResponseDto>> getAchievementsByClubId(@PathVariable UUID clubId) {
        return ResponseEntity.ok(achievementService.getAchievementsByClubId(clubId));
    }

    @PostMapping
    public ResponseEntity<AchievementResponseDto> createAchievement(
            @PathVariable UUID clubId,
            @RequestBody AchievementRequestDto achievementRequestDto
    ) {
        achievementRequestDto.setClubId(clubId);

        AchievementResponseDto createdAchievement = achievementService.createAchievement(achievementRequestDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAchievement.getAchievementId())
                .toUri();
        return ResponseEntity.created(location).body(createdAchievement);
    }

    @PutMapping("/{achievementId}")
    public ResponseEntity<AchievementResponseDto> updateAchievement(
            @PathVariable UUID clubId,
            @PathVariable UUID achievementId,
            @RequestBody AchievementRequestDto achievementRequestDto
    ) {
        achievementRequestDto.setClubId(clubId);
        AchievementResponseDto updatedAchievement = achievementService.updateAchievement(achievementId, achievementRequestDto);
        return ResponseEntity.ok(updatedAchievement);
    }


    @DeleteMapping("/{achievementId}")
    public ResponseEntity<Void> deleteAchievement(
            @PathVariable UUID clubId,
            @PathVariable UUID achievementId
    ) {
        achievementService.deleteAchievement(achievementId);
        return ResponseEntity.noContent().build();
    }
}