package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Club;
import com.example.fcmanager.dto.ClubResponseDto;
import com.example.fcmanager.dto.CreateClubRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PlayerMapper.class, AchievementMapper.class, AddressMapper.class})
public interface ClubMapper {
    @Mapping(source = "user.userId", target = "userId")
    ClubResponseDto toClubDto(Club club);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "players", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    Club createClubRequestDtoToClub(CreateClubRequestDto createClubRequestDto);
}