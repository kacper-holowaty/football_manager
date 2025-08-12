package com.example.fcmanager.controller;

import com.example.fcmanager.dto.ClubDto;
import com.example.fcmanager.dto.ClubSaveDto;
import com.example.fcmanager.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
}