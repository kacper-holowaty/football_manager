package com.example.fcmanager.feature.club.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.fcmanager.feature.club.dto.ClubResponseDto;
import com.example.fcmanager.feature.club.dto.CreateClubRequestDto;
import com.example.fcmanager.feature.club.dto.UpdateClubRequestDto;

public interface ClubService {
    Page<ClubResponseDto> getAllClubs(Pageable pageable);

    ClubResponseDto getClubById(UUID id);

    ClubResponseDto createClub(CreateClubRequestDto createClubRequestDto);

    ClubResponseDto updateClub(UUID id, UpdateClubRequestDto updateClubRequestDto);

    void deleteClub(UUID id);

    List<ClubResponseDto> getClubsByOwnerId(UUID userId);

    byte[] getClubBadge(UUID id);

    void removeClubBadge(UUID id);
}
