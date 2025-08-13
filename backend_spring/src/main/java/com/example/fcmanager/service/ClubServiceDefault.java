package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.fcmanager.dto.AchievementResponseDto;
import com.example.fcmanager.dto.ClubDto;
import com.example.fcmanager.dto.ClubSaveDto;
import com.example.fcmanager.mappers.AchievementMapper;
import com.example.fcmanager.mappers.ClubMapper;
import com.example.fcmanager.repository.AchievementRepository;
import com.example.fcmanager.repository.AddressRepository;
import com.example.fcmanager.repository.ClubRepository;
import com.example.fcmanager.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClubServiceDefault implements ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ClubMapper clubMapper;
    private final AchievementRepository achievementRepository;
    private final AchievementMapper achievementMapper;

    @Override
    public List<ClubDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(clubMapper::clubToClubDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClubDto getClubById(UUID id) {
        return clubRepository.findById(id)
                .map(clubMapper::clubToClubDto)
                .orElseThrow(() -> new RuntimeException("Club not found"));
    }

    @Override
    public ClubDto saveClub(ClubSaveDto clubSaveDto) {
        var club = clubMapper.clubSaveDtoToClub(clubSaveDto);
        var user = userRepository.findById(clubSaveDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var address = addressRepository.findById(clubSaveDto.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        club.setUser(user);
        club.setAddress(address);
        var savedClub = clubRepository.save(club);
        return clubMapper.clubToClubDto(savedClub);
    }

    @Override
    public void deleteClub(UUID id) {
        var club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        clubRepository.delete(club);
        if (club.getAddress() != null) {
            addressRepository.delete(club.getAddress());
        }
    }

    @Override
    public List<ClubDto> getClubsByUserId(UUID userId) {
        return clubRepository.findByUserId(userId).stream()
                .map(clubMapper::clubToClubDto)
                .collect(Collectors.toList());
    }
}