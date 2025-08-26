package com.example.fcmanager.feature.player.service;

import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.shared.exception.PlayerNotFoundException;
import com.example.fcmanager.shared.exception.ShirtNumberAlreadyTakenException;
import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.player.domain.Player;
import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;
import com.example.fcmanager.feature.player.mapper.PlayerMapper;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import com.example.fcmanager.feature.player.repository.PlayerRepository;
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
                .orElseThrow(() -> new PlayerNotFoundException(id.toString()));
    }

    @Override
    @Transactional
    public PlayerResponseDto createPlayer(UUID clubId, CreatePlayerRequestDto createPlayerRequestDto) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId.toString()));

        if (playerRepository.existsByClub_ClubIdAndShirtNumber(clubId, createPlayerRequestDto.getShirtNumber())) {
            throw new ShirtNumberAlreadyTakenException(createPlayerRequestDto.getShirtNumber());
        }

        Player player = playerMapper.createPlayerRequestDtoToPlayer(createPlayerRequestDto);
        player.setClub(club);

        Player savedPlayer = playerRepository.save(player);
        return playerMapper.toPlayerResponseDto(savedPlayer);
    }

    @Override
    @Transactional
    public PlayerResponseDto updatePlayer(UUID id, UpdatePlayerRequestDto dto) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id.toString()));

        if (playerRepository.existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(
                player.getClub().getClubId(), dto.getShirtNumber(), id)) {
            throw new ShirtNumberAlreadyTakenException(dto.getShirtNumber());
        }

        player.setName(dto.getName());
        if (dto.getPhoto() != null) {
            player.setPhoto(dto.getPhoto());
        } else {
            player.setPhoto(null);
        }
        player.setBirthDate(dto.getBirthDate());
        player.setNationality(dto.getNationality());
        player.setPositions(dto.getPositions());
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
                .orElseThrow(() -> new PlayerNotFoundException(id.toString()));
        playerRepository.delete(player);
    }

    @Override
    @Transactional
    public List<PlayerResponseDto> getPlayersByClubId(UUID clubId) {
        return playerRepository.findByClubClubId(clubId).stream()
                .map(playerMapper::toPlayerResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] getPlayerPhoto(UUID id) {
        return playerRepository.findById(id)
                .map(Player::getPhoto)
                .orElseThrow(() -> new PlayerNotFoundException(id.toString()));
    }

    @Override
    @Transactional
    public void removePlayerPhoto(UUID id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id.toString()));
        player.setPhoto(null);
        playerRepository.save(player);
    }
}