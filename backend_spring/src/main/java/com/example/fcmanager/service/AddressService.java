package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;

import com.example.fcmanager.dto.AddressRequestDto;
import com.example.fcmanager.dto.AddressResponseDto;
import jakarta.transaction.Transactional;

public interface AddressService {
    AddressResponseDto saveAddress(AddressRequestDto addressRequestDto);
    AddressResponseDto updateAddress(UUID addressId, AddressRequestDto addressRequestDto);

}