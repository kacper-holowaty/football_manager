package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Address;
import com.example.fcmanager.dto.AddressRequestDto;
import com.example.fcmanager.dto.AddressResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponseDto toAddressDto(Address address);

    Address addressRequestDtoToAddress(AddressRequestDto addressRequestDto);

    @Mapping(target = "addressId", ignore = true)
    void updateAddressFromDto(AddressRequestDto dto, @MappingTarget Address entity);
}