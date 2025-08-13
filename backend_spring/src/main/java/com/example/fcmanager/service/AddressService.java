package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.AddressResponseDto;

public interface AddressService {
    List<AddressResponseDto> getAllAddresses();
    AddressResponseDto saveAddress(AddressResponseDto addressDto);
    void deleteAddress(UUID addressId);
    AddressResponseDto updateAddress(AddressResponseDto addressDto);
}