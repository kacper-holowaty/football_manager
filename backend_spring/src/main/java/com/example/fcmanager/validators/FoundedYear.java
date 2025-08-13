package com.example.fcmanager.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FoundedYearValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FoundedYear {

    String message() default "Founded year must be between 1800 and the current year";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

