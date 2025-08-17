package com.example.fcmanager.auth.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.fcmanager.auth.dto.AuthenticationRequestDto;
import com.example.fcmanager.auth.dto.AuthenticationResponseDto;
import com.example.fcmanager.auth.dto.JwtTokenResponseDto;
import com.example.fcmanager.auth.dto.RegisterRequestDto;
import com.example.fcmanager.auth.service.AuthenticationService;
import com.example.fcmanager.feature.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDto> register(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        AuthenticationResponseDto authenticationResponseDto = authService.register(registerRequestDto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/users/{id}")
                .buildAndExpand(authenticationResponseDto.getUser().getUserId())
                .toUri();

        return ResponseEntity.created(location).body(authenticationResponseDto);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDto> authenticate(@RequestBody @Valid AuthenticationRequestDto request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtTokenResponseDto> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        String refreshToken = authHeader.substring(7);
        JwtTokenResponseDto jwtTokenResponseDto = authService.refreshToken(refreshToken);
        if (jwtTokenResponseDto == null) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(jwtTokenResponseDto);
    }
}
