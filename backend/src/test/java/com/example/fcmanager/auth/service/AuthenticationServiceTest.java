package com.example.fcmanager.auth.service;

import com.example.fcmanager.auth.dto.AuthenticationRequestDto;
import com.example.fcmanager.auth.dto.AuthenticationResponseDto;
import com.example.fcmanager.auth.dto.JwtTokenResponseDto;
import com.example.fcmanager.auth.dto.RegisterRequestDto;
import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.dto.AuthenticatedUserResponseDto;
import com.example.fcmanager.feature.user.mapper.UserMapper;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.shared.exception.TokenExpiredException;
import com.example.fcmanager.shared.exception.UserAlreadyExistsException;
import com.example.fcmanager.shared.exception.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthenticationServiceDefault authenticationService;

    private RegisterRequestDto registerRequestDto;
    private AuthenticationRequestDto authenticationRequestDto;
    private User user;
    private User savedUser;
    private AuthenticatedUserResponseDto authenticatedUserResponseDto;

    @BeforeEach
    void setUp() {
        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setFirstName("John");
        registerRequestDto.setLastName("Doe");
        registerRequestDto.setUsername("johndoe");
        registerRequestDto.setEmail("john@example.com");
        registerRequestDto.setPassword("password123");

        authenticationRequestDto = new AuthenticationRequestDto();
        authenticationRequestDto.setLogin("johndoe");
        authenticationRequestDto.setPassword("password123");

        UUID createUserId = UUID.randomUUID();

        user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .username("johndoe")
                .email("john@example.com")
                .password("encodedPassword")
                .build();

        savedUser = User.builder()
                .userId(createUserId)
                .firstName("John")
                .lastName("Doe")
                .username("johndoe")
                .email("john@example.com")
                .password("encodedPassword")
                .build();

        authenticatedUserResponseDto = new AuthenticatedUserResponseDto();
        authenticatedUserResponseDto.setUserId(createUserId);
        authenticatedUserResponseDto.setFirstName("John");
        authenticatedUserResponseDto.setLastName("Doe");
        authenticatedUserResponseDto.setUsername("johndoe");
        authenticatedUserResponseDto.setEmail("john@example.com");
    }

    @Test
    void register_ShouldReturnAuthenticationResponse_WhenUserDoesNotExist() {
        when(repository.existsByEmailOrUsername(registerRequestDto.getEmail(), registerRequestDto.getUsername()))
                .thenReturn(false);
        when(passwordEncoder.encode(registerRequestDto.getPassword()))
                .thenReturn("encodedPassword");
        when(repository.save(any(User.class)))
                .thenReturn(savedUser);
        when(userMapper.toAuthenticatedUserResponse(any(User.class)))
                .thenReturn(authenticatedUserResponseDto);
        when(jwtService.generateToken(savedUser))
                .thenReturn("accessToken");
        when(jwtService.generateRefreshToken(anyMap(), eq(savedUser)))
                .thenReturn("refreshToken");

        AuthenticationResponseDto result = authenticationService.register(registerRequestDto);

        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());
        assertEquals(authenticatedUserResponseDto, result.getUser());

        verify(repository).existsByEmailOrUsername(registerRequestDto.getEmail(), registerRequestDto.getUsername());
        verify(passwordEncoder).encode(registerRequestDto.getPassword());
        verify(repository).save(any(User.class));
        verify(userMapper).toAuthenticatedUserResponse(any(User.class));
        verify(jwtService).generateToken(savedUser);
        verify(jwtService).generateRefreshToken(anyMap(), eq(savedUser));
    }

    @Test
    void register_ShouldThrowUserAlreadyExistsException_WhenUserExists() {
        when(repository.existsByEmailOrUsername(registerRequestDto.getEmail(), registerRequestDto.getUsername()))
                .thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () ->
                authenticationService.register(registerRequestDto)
        );

        verify(repository).existsByEmailOrUsername(registerRequestDto.getEmail(), registerRequestDto.getUsername());
        verify(passwordEncoder, never()).encode(any());
        verify(repository, never()).save(any());
    }

    @Test
    void authenticate_ShouldReturnAuthenticationResponse_WhenCredentialsAreValid() {
        when(repository.findByUsernameOrEmail(authenticationRequestDto.getLogin(), authenticationRequestDto.getLogin()))
                .thenReturn(Optional.of(user));
        when(jwtService.generateToken(user))
                .thenReturn("accessToken");
        when(jwtService.generateRefreshToken(anyMap(), eq(user)))
                .thenReturn("refreshToken");
        when(userMapper.toAuthenticatedUserResponse(user))
                .thenReturn(authenticatedUserResponseDto);

        AuthenticationResponseDto result = authenticationService.authenticate(authenticationRequestDto);

        assertNotNull(result);
        assertEquals("accessToken", result.getAccessToken());
        assertEquals("refreshToken", result.getRefreshToken());
        assertEquals(authenticatedUserResponseDto, result.getUser());

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequestDto.getLogin(), authenticationRequestDto.getPassword())
        );
        verify(repository).findByUsernameOrEmail(authenticationRequestDto.getLogin(), authenticationRequestDto.getLogin());
        verify(jwtService).generateToken(user);
        verify(jwtService).generateRefreshToken(anyMap(), eq(user));
        verify(userMapper).toAuthenticatedUserResponse(user);
    }

    @Test
    void authenticate_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        when(repository.findByUsernameOrEmail(authenticationRequestDto.getLogin(), authenticationRequestDto.getLogin()))
                .thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                authenticationService.authenticate(authenticationRequestDto)
        );

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequestDto.getLogin(), authenticationRequestDto.getPassword())
        );
        verify(repository).findByUsernameOrEmail(authenticationRequestDto.getLogin(), authenticationRequestDto.getLogin());
        verify(jwtService, never()).generateToken(any());
        verify(jwtService, never()).generateRefreshToken(any(), any());
    }

    @Test
    void refreshToken_ShouldReturnJwtTokenResponse_WhenTokenIsValid() {
        String refreshToken = "validRefreshToken";
        String userEmail = "john@example.com";
        String newAccessToken = "newAccessToken";

        when(jwtService.extractUserName(refreshToken))
                .thenReturn(userEmail);
        when(repository.findByUsernameOrEmail(userEmail, userEmail))
                .thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(refreshToken, user))
                .thenReturn(true);
        when(jwtService.generateToken(user))
                .thenReturn(newAccessToken);

        JwtTokenResponseDto result = authenticationService.refreshToken(refreshToken);

        assertNotNull(result);
        assertEquals(newAccessToken, result.getAccessToken());
        assertEquals(refreshToken, result.getRefreshToken());

        verify(jwtService).extractUserName(refreshToken);
        verify(repository).findByUsernameOrEmail(userEmail, userEmail);
        verify(jwtService, times(2)).isTokenValid(refreshToken, user);
        verify(jwtService).generateToken(user);
    }

    @Test
    void refreshToken_ShouldThrowTokenExpiredException_WhenTokenIsNotValid() {
        String refreshToken = "invalidRefreshToken";
        String userEmail = "john@example.com";

        when(jwtService.extractUserName(refreshToken))
                .thenReturn(userEmail);
        when(repository.findByUsernameOrEmail(userEmail, userEmail))
                .thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(refreshToken, user))
                .thenReturn(false);

        assertThrows(TokenExpiredException.class, () ->
                authenticationService.refreshToken(refreshToken)
        );

        verify(jwtService).extractUserName(refreshToken);
        verify(repository).findByUsernameOrEmail(userEmail, userEmail);
        verify(jwtService).isTokenValid(refreshToken, user);
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void refreshToken_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        String refreshToken = "validRefreshToken";
        String userEmail = "john@example.com";

        when(jwtService.extractUserName(refreshToken))
                .thenReturn(userEmail);
        when(repository.findByUsernameOrEmail(userEmail, userEmail))
                .thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                authenticationService.refreshToken(refreshToken)
        );

        verify(jwtService).extractUserName(refreshToken);
        verify(repository).findByUsernameOrEmail(userEmail, userEmail);
        verify(jwtService, never()).isTokenValid(any(), any());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void refreshToken_ShouldReturnNull_WhenUserEmailIsNull() {
        String refreshToken = "refreshToken";

        when(jwtService.extractUserName(refreshToken))
                .thenReturn(null);

        JwtTokenResponseDto result = authenticationService.refreshToken(refreshToken);

        assertNull(result);

        verify(jwtService).extractUserName(refreshToken);
        verify(repository, never()).findByUsernameOrEmail(any(), any());
        verify(jwtService, never()).isTokenValid(any(), any());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void refreshToken_ShouldReturnNull_WhenTokenIsValidButSecondCheckFails() {
        String refreshToken = "validRefreshToken";
        String userEmail = "john@example.com";

        when(jwtService.extractUserName(refreshToken))
                .thenReturn(userEmail);
        when(repository.findByUsernameOrEmail(userEmail, userEmail))
                .thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(refreshToken, user))
                .thenReturn(true)
                .thenReturn(false);

        JwtTokenResponseDto result = authenticationService.refreshToken(refreshToken);

        assertNull(result);

        verify(jwtService).extractUserName(refreshToken);
        verify(repository).findByUsernameOrEmail(userEmail, userEmail);
        verify(jwtService, times(2)).isTokenValid(refreshToken, user);
        verify(jwtService, never()).generateToken(any());
    }
}