package com.example.fcmanager.auth.service;

import com.example.fcmanager.auth.dto.AuthenticationRequestDto;
import com.example.fcmanager.auth.dto.AuthenticationResponseDto;
import com.example.fcmanager.auth.dto.JwtTokenResponseDto;
import com.example.fcmanager.auth.dto.RegisterRequestDto;

public interface AuthenticationService {

    AuthenticationResponseDto register(RegisterRequestDto request);

    AuthenticationResponseDto authenticate(AuthenticationRequestDto request);

    JwtTokenResponseDto refreshToken(String refreshToken);
}
