package com.example.fcmanager.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePlayerRequestDto {
    private String name;
    private byte[] photo;
    private LocalDate birthDate;
    private String nationality;
    private String position;
    private int shirtNumber;
    private LocalDate contractUntil;
    private int salary;
    private UUID clubId;
}