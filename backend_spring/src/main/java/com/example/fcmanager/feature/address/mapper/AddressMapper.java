package com.example.fcmanager.feature.address.mapper;

import com.example.fcmanager.feature.address.domain.Address;
import com.example.fcmanager.feature.address.dto.AddressRequestDto;
import com.example.fcmanager.feature.address.dto.AddressResponseDto;
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