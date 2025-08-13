package com.example.fcmanager.service;

import com.example.fcmanager.domain.Club;
import com.example.fcmanager.domain.Player;
import com.example.fcmanager.dto.PlayerResponseDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import com.example.fcmanager.dto.UpdatePlayerRequestDto;
import com.example.fcmanager.mappers.PlayerMapper;
import com.example.fcmanager.repository.ClubRepository;
import com.example.fcmanager.repository.PlayerRepository;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerServiceDefault implements PlayerService {

    private final PlayerRepository playerRepository;
    private final ClubRepository clubRepository;
    private final PlayerMapper playerMapper;

    @Override
    public PlayerResponseDto getPlayerById(UUID id) {
        return playerRepository.findById(id)
                .map(playerMapper::toPlayerResponseDto)
                .orElseThrow(() -> new EntityNotFoundException("No player found with id: " + id));
    }

    @Override
    @Transactional
    public PlayerResponseDto createPlayer(CreatePlayerRequestDto createPlayerRequestDto) {
        Player player = playerMapper.createPlayerRequestDtoToPlayer(createPlayerRequestDto);
        Club club = clubRepository.findById(createPlayerRequestDto.getClubId())
                .orElseThrow(() -> new EntityNotFoundException("No club found with id: " + createPlayerRequestDto.getClubId()));

        if (playerRepository.existsByClub_ClubIdAndShirtNumber(createPlayerRequestDto.getClubId(), createPlayerRequestDto.getShirtNumber())) {
            throw new IllegalArgumentException("Shirt number " + createPlayerRequestDto.getShirtNumber() + " is already taken in this club.");
        }

        player.setClub(club);
        Player savedPlayer = playerRepository.save(player);
        return playerMapper.toPlayerResponseDto(savedPlayer);
    }


    @Override
    @Transactional
    public PlayerResponseDto updatePlayer(UUID id, UpdatePlayerRequestDto dto) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + id));

        if (playerRepository.existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(player.getClub().getClubId(), dto.getShirtNumber(), id)) {
            throw new IllegalArgumentException("Shirt number " + dto.getShirtNumber() + " is already taken in this club."
            );
        }

        player.setName(dto.getName());
        player.setPhoto(dto.getPhoto());
        player.setBirthDate(dto.getBirthDate());
        player.setNationality(dto.getNationality());
        player.setPosition(dto.getPosition());
        player.setShirtNumber(dto.getShirtNumber());
        player.setContractUntil(dto.getContractUntil());
        player.setSalary(dto.getSalary());

        Player updatedPlayer = playerRepository.save(player);
        return playerMapper.toPlayerResponseDto(updatedPlayer);
    }

    @Override
    @Transactional
    public void deletePlayer(UUID id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + id));
        playerRepository.delete(player);
    }

    @Override
    public List<PlayerResponseDto> getPlayersByClubId(UUID clubId) {
        return playerRepository.findByClub_ClubId(clubId).stream()
                .map(playerMapper::toPlayerResponseDto)
                .collect(Collectors.toList());
    }
}