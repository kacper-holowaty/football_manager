package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Player;
import com.example.fcmanager.dto.PlayerResponseDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(source = "club.clubId", target = "clubId")
    PlayerResponseDto toPlayerResponseDto(Player player);

    @Mapping(target = "club", ignore = true)
    Player createPlayerRequestDtoToPlayer(CreatePlayerRequestDto createPlayerRequestDto);
}