package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Player;
import com.example.fcmanager.dto.PlayerDto;
import com.example.fcmanager.dto.CreatePlayerRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PlayerMapper {

    PlayerMapper INSTANCE = Mappers.getMapper(PlayerMapper.class);

    @Mapping(source = "club.clubId", target = "clubId")
    PlayerDto playerToPlayerDto(Player player);

    @Mapping(target = "club", ignore = true)
    Player playerSaveDtoToPlayer(CreatePlayerRequestDto createPlayerRequestDto);
}