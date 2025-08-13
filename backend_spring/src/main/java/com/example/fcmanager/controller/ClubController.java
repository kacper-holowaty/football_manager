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

import com.example.fcmanager.dto.AchievementResponseDto;
import com.example.fcmanager.dto.ClubDto;
import com.example.fcmanager.dto.ClubSaveDto;
import com.example.fcmanager.service.ClubService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubDto>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubDto> getClubById(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PostMapping
    public ResponseEntity<ClubDto> saveClub(@RequestBody ClubSaveDto clubSaveDto) {
        return new ResponseEntity<>(clubService.saveClub(clubSaveDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable UUID id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClubDto>> getClubsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(clubService.getClubsByUserId(userId));
    }

    @PostMapping("/{clubId}/achievements")
    public ResponseEntity<ClubDto> addAchievementToClub(@PathVariable UUID clubId, @RequestBody AchievementResponseDto achievementResponseDto) {
        return ResponseEntity.ok(clubService.addAchievementToClub(clubId, achievementResponseDto));
    }

    @DeleteMapping("/{clubId}/achievements/{achievementId}")
    public ResponseEntity<Void> removeAchievementFromClub(@PathVariable UUID clubId, @PathVariable UUID achievementId) {
        clubService.removeAchievementFromClub(clubId, achievementId);
        return ResponseEntity.noContent().build();
    }
}