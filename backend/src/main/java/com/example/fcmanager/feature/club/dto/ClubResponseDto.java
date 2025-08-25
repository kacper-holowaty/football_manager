package com.example.fcmanager.feature.club.dto;

import java.util.UUID;

import com.example.fcmanager.feature.address.dto.AddressResponseDto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubResponseDto {
    private UUID clubId;
    private String name;
    private Integer foundedYear;
    private String stadiumName;
    private Integer stadiumCapacity;
    private AddressResponseDto address;
    private boolean hasBadge;
    private UUID ownerId;
}