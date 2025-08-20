package com.example.fcmanager.feature.achievement.controller;

import com.example.fcmanager.feature.achievement.dto.AchievementRequestDto;
import com.example.fcmanager.feature.achievement.dto.AchievementResponseDto;
import com.example.fcmanager.feature.achievement.service.AchievementService;
import com.example.fcmanager.shared.dto.ApiResponse;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<List<AchievementResponseDto>>> getAchievementsByClubId(@PathVariable UUID clubId) {
        List<AchievementResponseDto> achievements = achievementService.getAchievementsByClubId(clubId);
        return ResponseEntity.ok(ApiResponse.success(achievements));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AchievementResponseDto>> createAchievement(
            @PathVariable UUID clubId,
            @Valid @RequestBody AchievementRequestDto achievementRequestDto
    ) {
        AchievementResponseDto createdAchievement = achievementService.createAchievement(clubId, achievementRequestDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAchievement.getAchievementId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created(createdAchievement, "Achievement created successfully"));
    }

    @PutMapping("/{achievementId}")
    public ResponseEntity<ApiResponse<AchievementResponseDto>> updateAchievement(
            @PathVariable UUID clubId,
            @PathVariable UUID achievementId,
            @Valid @RequestBody AchievementRequestDto achievementRequestDto
    ) {
        AchievementResponseDto updatedAchievement = achievementService.updateAchievement(achievementId, achievementRequestDto);
        return ResponseEntity.ok(ApiResponse.success(updatedAchievement, "Achievement updated successfully"));
    }


    @DeleteMapping("/{achievementId}")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(
            @PathVariable UUID clubId,
            @PathVariable UUID achievementId
    ) {
        achievementService.deleteAchievement(achievementId);
        return ResponseEntity.ok(ApiResponse.success(null, "Achievement deleted successfully"));
    }
}