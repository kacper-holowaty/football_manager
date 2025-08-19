package com.example.fcmanager.validators;

import com.example.fcmanager.auth.dto.AuthenticationRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

@Component
public class LoginFieldValidator implements ConstraintValidator<ValidLoginField, AuthenticationRequestDto> {

    @Override
    public boolean isValid(AuthenticationRequestDto dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getLogin() == null) {
            return false;
        }

        String login = dto.getLogin().trim();

        if (login.contains("@")) {
            return login.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
        }
        else {
            return login.matches("^[A-Za-z][A-Za-z0-9_]{2,29}$");
        }
    }
}