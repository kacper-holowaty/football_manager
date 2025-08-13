package com.example.fcmanager.service;

import java.util.UUID;

import com.example.fcmanager.domain.Address;
import com.example.fcmanager.dto.AddressRequestDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    @Transactional
    public AddressResponseDto saveAddress(AddressRequestDto addressRequestDto) {
        Address address = addressMapper.addressRequestDtoToAddress(addressRequestDto);
        Address savedAddress = addressRepository.save(address);
        return addressMapper.toAddressDto(savedAddress);
    }

    @Override
    @Transactional
    public AddressResponseDto updateAddress(UUID addressId, AddressRequestDto addressRequestDto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + addressId));

        address.setStreet(addressRequestDto.getStreet());
        address.setHouseNumber(addressRequestDto.getHouseNumber());
        address.setApartmentNumber(addressRequestDto.getApartmentNumber());
        address.setPostalCode(addressRequestDto.getPostalCode());
        address.setCity(addressRequestDto.getCity());
        address.setCountry(addressRequestDto.getCountry());

        Address updatedAddress = addressRepository.save(address);
        return addressMapper.toAddressDto(updatedAddress);
    }
}