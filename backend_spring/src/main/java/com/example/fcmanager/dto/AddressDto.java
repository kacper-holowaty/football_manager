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
public class AddressDto {
    private UUID addressId;
    private String street;
    private int houseNumber;
    private int apartmentNumber;
    private String postalCode;
    private String city;
    private String country;
}