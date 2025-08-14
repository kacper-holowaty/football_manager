package com.example.fcmanager.feature.player.mapper;

import com.example.fcmanager.feature.player.domain.Player;
import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(source = "club.clubId", target = "clubId")
    PlayerResponseDto toPlayerResponseDto(Player player);

    @Mapping(target = "club", ignore = true)
    Player createPlayerRequestDtoToPlayer(CreatePlayerRequestDto createPlayerRequestDto);
}