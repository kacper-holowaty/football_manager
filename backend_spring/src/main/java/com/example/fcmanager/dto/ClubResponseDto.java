package com.example.fcmanager.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubResponseDto {
    private UUID clubId;
    private String name;
    private byte[] badge;
    private Integer foundedYear;
    private String stadiumName;
    private Integer stadiumCapacity;
    private AddressResponseDto address;
    private UUID userId;
}