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
import com.example.fcmanager.shared.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponseDto>> register(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        AuthenticationResponseDto authenticationResponseDto = authService.register(registerRequestDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/users/{id}")
                .buildAndExpand(authenticationResponseDto.getUser().getUserId())
                .toUri();

        ApiResponse<AuthenticationResponseDto> response = ApiResponse.created(
                authenticationResponseDto,
                "User registered successfully"
        );

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticationResponseDto>> authenticate(@RequestBody @Valid AuthenticationRequestDto request) {
        AuthenticationResponseDto authResponse = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Authentication successful"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtTokenResponseDto>> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(400)
                    .body(ApiResponse.badRequest("Missing or invalid Authorization header"));
        }

        String refreshToken = authHeader.substring(7);
        JwtTokenResponseDto jwtTokenResponseDto = authService.refreshToken(refreshToken);

        return ResponseEntity.ok(ApiResponse.success(jwtTokenResponseDto, "Token refreshed successfully"));
    }
}
