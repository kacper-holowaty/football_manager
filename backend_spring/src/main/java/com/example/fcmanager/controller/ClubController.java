package com.example.fcmanager.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fcmanager.service.ClubService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubResponseDto>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponseDto> getClubById(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PostMapping
    public ResponseEntity<ClubResponseDto> createClub(@RequestBody CreateClubRequestDto createClubRequestDto) {
        ClubResponseDto createdClub = clubService.createClub(createClubRequestDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdClub.getClubId())
                .toUri();
        return ResponseEntity.created(location).body(createdClub);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubResponseDto> updateClub(
            @PathVariable UUID id,
            @RequestBody UpdateClubRequestDto updateClubRequestDto) {

        ClubResponseDto updatedClub = clubService.updateClub(id, updateClubRequestDto);
        return ResponseEntity.ok(updatedClub);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable UUID id) {
        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClubResponseDto>> getClubsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(clubService.getClubsByUserId(userId));
    }
}