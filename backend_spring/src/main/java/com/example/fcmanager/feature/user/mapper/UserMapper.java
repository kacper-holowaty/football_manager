package com.example.fcmanager.feature.user.mapper;

import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.AuthenticatedUserResponseDto;
import com.example.fcmanager.feature.user.dto.UserResponseDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toUserDto(User user);

    AuthenticatedUserResponseDto toAuthenticatedUserResponse(User user);
}