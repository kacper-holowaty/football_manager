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
public class AddressResponseDto {
    private UUID addressId;
    private String street;
    private int houseNumber;
    private Integer apartmentNumber;
    private String postalCode;
    private String city;
    private String country;
}