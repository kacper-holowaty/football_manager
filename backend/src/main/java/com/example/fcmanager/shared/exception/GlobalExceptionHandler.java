package com.example.fcmanager.shared.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.example.fcmanager.shared.dto.ApiResponse;

import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation failed for request: {} with errors: {}",
                request.getDescription(false), errors);

        return ResponseEntity.badRequest()
                .body(ApiResponse.badRequest("Validation failed"));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {
        log.warn("Authentication failed for request: {}", request.getDescription(false));
        return ResponseEntity.status(401)
                .body(ApiResponse.unauthorized("Invalid login or password."));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied for request: {} - {}", request.getDescription(false), ex.getMessage());
        return ResponseEntity.status(403)
                .body(ApiResponse.forbidden("Access denied"));
    }

    @ExceptionHandler(ClubAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleClubAlreadyExists(
            ClubAlreadyExistsException ex, WebRequest request) {
        log.warn("Club already exists: {}", ex.getMessage());
        return ResponseEntity.status(409)
                .body(ApiResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserAlreadyExists(
            UserAlreadyExistsException ex, WebRequest request) {
        log.warn("User already exists: {}", ex.getMessage());
        return ResponseEntity.status(409)
                .body(ApiResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(
            EntityNotFoundException ex, WebRequest request) {
        log.warn("Entity not found: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound("Requested resource not found"));
    }

    @ExceptionHandler(AchievementNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleAchievementNotFound(
            UserNotFoundException ex, WebRequest request) {
        log.warn("Achievement not found: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(ClubNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleClubNotFound(
            UserNotFoundException ex, WebRequest request) {
        log.warn("Club not found: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handlePlayerNotFound(
            UserNotFoundException ex, WebRequest request) {
        log.warn("Player not found: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFound(
            UserNotFoundException ex, WebRequest request) {
        log.warn("User not found: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundWithIdException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFoundWithId(
            UserNotFoundWithIdException ex, WebRequest request) {
        log.warn("User not found with id: {}", ex.getMessage());
        return ResponseEntity.status(404)
                .body(ApiResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleJwtException(
            JwtException ex, WebRequest request) {
        log.warn("JWT error for request: {} - {}", request.getDescription(false), ex.getMessage());
        return ResponseEntity.status(403)
                .body(ApiResponse.forbidden("Invalid or expired token"));
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenExpired(
            TokenExpiredException ex, WebRequest request) {
        log.warn("Token expired for request: {}", request.getDescription(false));
        return ResponseEntity.status(401)
                .body(ApiResponse.unauthorized(ex.getMessage()));
    }

    @ExceptionHandler(ShirtNumberAlreadyTakenException.class)
    public ResponseEntity<ApiResponse<Void>> handleShirtNumberAlreadyTaken(
            ShirtNumberAlreadyTakenException ex, WebRequest request) {

        log.warn("Shirt number conflict: {}", ex.getMessage());

        return ResponseEntity.status(409)
                .body(ApiResponse.error(409, ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        log.warn("Invalid argument for request: {} - {}", request.getDescription(false), ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.badRequest("Invalid request parameters: " + ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        log.error("Runtime exception for request: {}", request.getDescription(false), ex);
        return ResponseEntity.status(500)
                .body(ApiResponse.error(500, "An unexpected error occurred"));
    }

    @ExceptionHandler(FileProcessingException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileProcessingException(
            FileProcessingException ex, WebRequest request) {
        log.error("File processing error for request: {} - {}", request.getDescription(false), ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.badRequest("Error processing uploaded file: " + ex.getMessage()));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ApiResponse<Void>> handleIOException(
            IOException ex, WebRequest request) {
        log.error("File processing error for request: {} - {}", request.getDescription(false), ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.badRequest("Error processing uploaded file: " + ex.getMessage()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxSizeException(
            MaxUploadSizeExceededException ex, WebRequest request) {
        log.warn("File size exceeded for request: {}", request.getDescription(false));
        return ResponseEntity.badRequest()
                .body(ApiResponse.badRequest("File size exceeds maximum allowed limit"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex, WebRequest request) {
        log.error("Unexpected error for request: {}", request.getDescription(false), ex);
        return ResponseEntity.status(500)
                .body(ApiResponse.error(500, "Internal server error"));
    }
}
