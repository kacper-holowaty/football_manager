package com.example.fcmanager.mappers;

import com.example.fcmanager.domain.Address;
import com.example.fcmanager.dto.AddressDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    AddressMapper INSTANCE = Mappers.getMapper(AddressMapper.class);

    AddressDto addressToAddressDto(Address address);

    Address addressDtoToAddress(AddressDto addressDto);
}