package com.example.fcmanager.feature.player.mapper;

import com.example.fcmanager.feature.player.domain.Player;
import com.example.fcmanager.feature.player.dto.PlayerResponseDto;
import com.example.fcmanager.feature.player.dto.CreatePlayerRequestDto;
import com.example.fcmanager.feature.player.dto.UpdatePlayerRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(target = "hasPhoto", expression = "java(player.getPhoto() != null && player.getPhoto().length > 0)")
    @Mapping(target = "positions", expression = "java(splitPositions(player.getPositions()))")
    @Mapping(source = "club.clubId", target = "clubId")
    PlayerResponseDto toPlayerResponseDto(Player player);

    @Mapping(target = "club", ignore = true)
    Player createPlayerRequestDtoToPlayer(CreatePlayerRequestDto createPlayerRequestDto);

    default List<String> splitPositions(String positions) {
        if (positions == null || positions.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(positions.split(","));
    }
}