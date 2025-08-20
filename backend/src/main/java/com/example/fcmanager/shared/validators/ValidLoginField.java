package com.example.fcmanager.shared.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LoginFieldValidator.class)
public @interface ValidLoginField {
    String message() default "Login must be a valid email or username (3-30 chars, letters/digits/underscore)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
