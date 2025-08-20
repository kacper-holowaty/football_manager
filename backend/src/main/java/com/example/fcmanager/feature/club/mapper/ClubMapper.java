package com.example.fcmanager.feature.club.mapper;

import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.club.dto.ClubResponseDto;
import com.example.fcmanager.feature.club.dto.CreateClubRequestDto;
import com.example.fcmanager.feature.achievement.mapper.AchievementMapper;
import com.example.fcmanager.feature.address.mapper.AddressMapper;
import com.example.fcmanager.feature.player.mapper.PlayerMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PlayerMapper.class, AchievementMapper.class, AddressMapper.class})
public interface ClubMapper {
    @Mapping(source = "user.userId", target = "ownerId")
    ClubResponseDto toClubDto(Club club);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "players", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    Club createClubRequestDtoToClub(CreateClubRequestDto createClubRequestDto);
}