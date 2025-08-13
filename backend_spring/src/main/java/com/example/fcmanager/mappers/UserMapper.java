package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.User;
import com.example.fcmanager.dto.UserResponseDto;
import com.example.fcmanager.dto.UserSaveDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto userToUserDto(User user);

    @Mapping(target = "clubs", ignore = true)
    User userSaveDtoToUser(UserSaveDto userSaveDto);
}