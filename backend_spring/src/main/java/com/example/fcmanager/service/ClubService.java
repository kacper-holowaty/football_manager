package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.ClubResponseDto;
import com.example.fcmanager.dto.CreateClubRequestDto;
import com.example.fcmanager.dto.UpdateClubRequestDto;

public interface ClubService {
    List<ClubResponseDto> getAllClubs();
    ClubResponseDto getClubById(UUID id);
    ClubResponseDto createClub(CreateClubRequestDto createClubRequestDto);
    ClubResponseDto updateClub(UUID id, UpdateClubRequestDto updateClubRequestDto);
    void deleteClub(UUID id);
    List<ClubResponseDto> getClubsByUserId(UUID userId);
}