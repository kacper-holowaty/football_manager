package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Club;
import com.example.fcmanager.dto.ClubDto;
import com.example.fcmanager.dto.ClubSaveDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {PlayerMapper.class, AchievementMapper.class, AddressMapper.class})
public interface ClubMapper {
    @Mapping(source = "user.userId", target = "userId")
    ClubDto clubToClubDto(Club club);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "players", ignore = true)
    @Mapping(target = "achievements", ignore = true)
    Club clubSaveDtoToClub(ClubSaveDto clubSaveDto);
}