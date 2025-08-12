package com.example.fcmanager.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubSaveDto {
    private String name;
    private byte[] badge;
    private int foundedYear;
    private String stadiumName;
    private int stadiumCapacity;
    private UUID userId;
    private UUID addressId;
}