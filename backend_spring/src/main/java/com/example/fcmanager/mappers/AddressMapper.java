package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Address;
import com.example.fcmanager.dto.AddressResponseDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponseDto addressToAddressDto(Address address);

    Address addressDtoToAddress(AddressResponseDto addressDto);
}