package com.example.fcmanager.feature.user.mapper;

import org.mapstruct.Mapper;

import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.AuthenticatedUserResponseDto;
import com.example.fcmanager.feature.user.dto.UserResponseDto;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toUserDto(User user);

    AuthenticatedUserResponseDto toAuthenticatedUserResponse(User user);
}