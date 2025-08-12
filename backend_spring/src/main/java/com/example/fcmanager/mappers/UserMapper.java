package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.User;
import com.example.fcmanager.dto.UserDto;
import com.example.fcmanager.dto.UserSaveDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto userToUserDto(User user);

    @Mapping(target = "clubs", ignore = true)
    User userSaveDtoToUser(UserSaveDto userSaveDto);
}