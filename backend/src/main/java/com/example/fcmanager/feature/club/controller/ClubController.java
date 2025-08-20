package com.example.fcmanager.feature.club.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.fcmanager.feature.club.dto.ClubResponseDto;
import com.example.fcmanager.feature.club.dto.CreateClubRequestDto;
import com.example.fcmanager.feature.club.dto.UpdateClubRequestDto;
import com.example.fcmanager.feature.club.service.ClubService;
import com.example.fcmanager.shared.dto.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClubResponseDto>>> getAllClubs() {
        List<ClubResponseDto> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(ApiResponse.success(clubs, "Clubs fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubResponseDto>> getClubById(@PathVariable UUID id) {
        ClubResponseDto club = clubService.getClubById(id);
        return ResponseEntity.ok(ApiResponse.success(club, "Club fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClubResponseDto>> createClub(
            @Valid @RequestBody CreateClubRequestDto createClubRequestDto
    ) {
        ClubResponseDto createdClub = clubService.createClub(createClubRequestDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdClub.getClubId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(ApiResponse.created(createdClub, "Club created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubResponseDto>> updateClub(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateClubRequestDto updateClubRequestDto) {

        ClubResponseDto updatedClub = clubService.updateClub(id, updateClubRequestDto);
        return ResponseEntity.ok(ApiResponse.success(updatedClub, "Club updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClub(@PathVariable UUID id) {
        clubService.deleteClub(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Club deleted successfully"));
    }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<ApiResponse<List<ClubResponseDto>>> getClubsByUserId(@PathVariable UUID ownerId) {
        List<ClubResponseDto> clubs = clubService.getClubsByOwnerId(ownerId);
        return ResponseEntity.ok(ApiResponse.success(clubs, "Clubs fetched successfully for user"));
    }
}