package com.example.fcmanager.feature.club.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import com.example.fcmanager.feature.club.dto.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ClubResponseDto>> createClub(
            @Valid @ModelAttribute CreateClubMultipartRequestDto request
    ) {
        CreateClubRequestDto createClubRequestDto = request.toCreateClubRequestDto();
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ClubResponseDto>> updateClub(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateClubMultipartRequestDto request
    ) {
        UpdateClubRequestDto updateClubRequestDto = request.toUpdateClubRequestDto();
        ClubResponseDto updatedClub = clubService.updateClub(id, updateClubRequestDto);

        return ResponseEntity.ok(ApiResponse.success(updatedClub, "Club updated successfully"));
    }

    @GetMapping("/{id}/badge")
    public ResponseEntity<byte[]> getClubBadge(@PathVariable UUID id) {
        byte[] badge = clubService.getClubBadge(id);

        if (badge == null || badge.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(badge.length);
        headers.setCacheControl("no-cache, no-store, must-revalidate");

        return ResponseEntity.ok()
                .headers(headers)
                .body(badge);
    }

    @DeleteMapping("/{id}/badge")
    public ResponseEntity<ApiResponse<Void>> removeClubBadge(@PathVariable UUID id) {
        clubService.removeClubBadge(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Club badge removed successfully"));
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