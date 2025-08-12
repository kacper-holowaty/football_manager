package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.ClubDto;
import com.example.fcmanager.dto.ClubSaveDto;

public interface ClubService {
    List<ClubDto> getAllClubs();
    ClubDto getClubById(UUID id);
    ClubDto saveClub(ClubSaveDto clubSaveDto);
    void deleteClub(UUID id);
    List<ClubDto> getClubsByUserId(UUID userId);
}