package com.example.fcmanager.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtServiceDefault jwtService;
    private UserDetails userDetails;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long jwtExpiration = 86400000;
    private final long refreshExpiration = 604800000;

    @BeforeEach
    void setUp() {
        jwtService = new JwtServiceDefault();
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", jwtExpiration);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", refreshExpiration);

        userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testuser");
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "USER");

        String refreshToken = jwtService.generateRefreshToken(extraClaims, userDetails);

        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        assertEquals(3, refreshToken.split("\\.").length);
    }

    @Test
    void extractUserName_ShouldReturnCorrectUsername() {
        String token = jwtService.generateToken(userDetails);

        String extractedUsername = jwtService.extractUserName(token);

        assertEquals("testuser", extractedUsername);
    }

    @Test
    void isTokenValid_ShouldReturnTrue_WhenTokenIsValid() {
        String token = jwtService.generateToken(userDetails);

        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenUsernamesDoNotMatch() {
        String token = jwtService.generateToken(userDetails);
        UserDetails differentUser = mock(UserDetails.class);
        when(differentUser.getUsername()).thenReturn("differentuser");

        boolean isValid = jwtService.isTokenValid(token, differentUser);

        assertFalse(isValid);
    }

    @Test
    void generateToken_WithEmptyExtraClaims_ShouldCreateValidToken() {
        String token = jwtService.generateToken(userDetails);
        Claims claims = extractClaimsFromToken(token);

        assertNotNull(claims);
        assertEquals("testuser", claims.getSubject());
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }

    @Test
    void generateRefreshToken_WithExtraClaims_ShouldIncludeClaimsInToken() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ADMIN");
        extraClaims.put("department", "IT");

        String refreshToken = jwtService.generateRefreshToken(extraClaims, userDetails);
        Claims claims = extractClaimsFromToken(refreshToken);

        assertEquals("testuser", claims.getSubject());
        assertEquals("ADMIN", claims.get("role"));
        assertEquals("IT", claims.get("department"));
    }

    @Test
    void extractUserName_FromRefreshToken_ShouldReturnCorrectUsername() {
        Map<String, Object> extraClaims = new HashMap<>();
        String refreshToken = jwtService.generateRefreshToken(extraClaims, userDetails);

        String extractedUsername = jwtService.extractUserName(refreshToken);

        assertEquals("testuser", extractedUsername);
    }

    @Test
    void tokenExpiration_ShouldBeSetCorrectly() {
        String token = jwtService.generateToken(userDetails);
        Claims claims = extractClaimsFromToken(token);

        long expectedExpirationTime = System.currentTimeMillis() + jwtExpiration;
        long actualExpirationTime = claims.getExpiration().getTime();

        assertTrue(Math.abs(expectedExpirationTime - actualExpirationTime) < 5000);
    }

    @Test
    void refreshTokenExpiration_ShouldBeSetCorrectly() {
        Map<String, Object> extraClaims = new HashMap<>();
        String refreshToken = jwtService.generateRefreshToken(extraClaims, userDetails);
        Claims claims = extractClaimsFromToken(refreshToken);

        long expectedExpirationTime = System.currentTimeMillis() + refreshExpiration;
        long actualExpirationTime = claims.getExpiration().getTime();

        assertTrue(Math.abs(expectedExpirationTime - actualExpirationTime) < 5000);
    }

    @Test
    void issuedAt_ShouldBeSetToCurrentTime() {
        String token = jwtService.generateToken(userDetails);
        long afterTokenGeneration = System.currentTimeMillis();

        Claims claims = extractClaimsFromToken(token);
        long issuedAtTime = claims.getIssuedAt().getTime();

        assertTrue(issuedAtTime <= afterTokenGeneration);
    }

    private Claims extractClaimsFromToken(String token) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
