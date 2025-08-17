package com.example.fcmanager.auth.service;

import com.example.fcmanager.auth.dto.AuthenticationResponseDto;
import com.example.fcmanager.auth.dto.AuthenticationRequestDto;
import com.example.fcmanager.auth.dto.AuthenticationResponseDto;
import com.example.fcmanager.auth.dto.JwtTokenResponseDto;
import com.example.fcmanager.auth.dto.RegisterRequestDto;
import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.AuthenticatedUserResponseDto;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.feature.user.mapper.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceDefault implements AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    public AuthenticationResponseDto register(@Valid RegisterRequestDto registerRequestDto) {
        User user = User.builder()
                .firstName(registerRequestDto.getFirstName())
                .username(registerRequestDto.getUsername())
                .lastName(registerRequestDto.getLastName())
                .email(registerRequestDto.getEmail())
                .password(passwordEncoder.encode(registerRequestDto.getPassword()))
                .build();
        User savedUser = repository.save(user);
        AuthenticatedUserResponseDto authenticatedUserResponseDto = userMapper.toAuthenticatedUserResponse(user);
        String jwtToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), savedUser);
        return AuthenticationResponseDto.builder().accessToken(jwtToken).refreshToken(refreshToken).user(authenticatedUserResponseDto).build();
    }

    public AuthenticationResponseDto authenticate(AuthenticationRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );
        User user = repository.findByUsernameOrEmail(request.getLogin(), request.getLogin())
                .orElseThrow();
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), user);
        AuthenticatedUserResponseDto authenticatedUserResponseDto = userMapper.toAuthenticatedUserResponse(user);

        return AuthenticationResponseDto.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(authenticatedUserResponseDto)
                .build();
    }

    @Override
    public JwtTokenResponseDto refreshToken(String refreshToken) {
        String userEmail = jwtService.extractUserName(refreshToken);
        if (userEmail != null) {
            User user = this.repository.findByUsernameOrEmail(userEmail, userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                String accessToken = jwtService.generateToken(user);
                return JwtTokenResponseDto.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        return null;
    }
}
