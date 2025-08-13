package com.example.fcmanager.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.fcmanager.dto.AddressResponseDto;
import com.example.fcmanager.mappers.AddressMapper;
import com.example.fcmanager.repository.AddressRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceDefault implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Override
    public List<AddressResponseDto> getAllAddresses() {
        return addressRepository.findAll().stream()
                .map(addressMapper::addressToAddressDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponseDto saveAddress(AddressResponseDto addressDto) {
        var address = addressMapper.addressDtoToAddress(addressDto);
        var savedAddress = addressRepository.save(address);
        return addressMapper.addressToAddressDto(savedAddress);
    }

    @Override
    public void deleteAddress(UUID addressId) {
        var address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        var club = address.getClub();
        if (club != null) {
            club.setAddress(null);
        }
        addressRepository.delete(address);
    }

    @Override
    public AddressResponseDto updateAddress(AddressResponseDto addressDto) {
        var address = addressRepository.findById(addressDto.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        address.setStreet(addressDto.getStreet());
        address.setHouseNumber(addressDto.getHouseNumber());
        address.setApartmentNumber(addressDto.getApartmentNumber());
        address.setPostalCode(addressDto.getPostalCode());
        address.setCity(addressDto.getCity());
        address.setCountry(addressDto.getCountry());
        var savedAddress = addressRepository.save(address);
        return addressMapper.addressToAddressDto(savedAddress);
    }
}