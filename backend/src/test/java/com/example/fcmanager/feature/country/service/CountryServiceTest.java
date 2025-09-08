package com.example.fcmanager.feature.country.service;

import com.example.fcmanager.feature.country.domain.Country;
import com.example.fcmanager.feature.country.dto.CountryCodeMappingDto;
import com.example.fcmanager.feature.country.dto.CountryCodeResponseDto;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CountryServiceTest {

    private CountryService countryService;

    @BeforeEach
    void setUp() {
        countryService = new CountryService();
        countryService.loadCountries();
    }

    @Test
    void loadCountries_ShouldLoadSuccessfully() {
        List<Country> result = countryService.getAllCountries();
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
    }

    @Test
    void getAllCountries_ShouldReturnCountries() {
        List<Country> result = countryService.getAllCountries();
        assertEquals(2, result.size());
        assertEquals("Poland", result.getFirst().getCountry());
    }

    @Test
    void getCountryCode_ShouldReturnCountryCode_WhenCountryExists() {
        CountryCodeResponseDto result = countryService.getCountryCode("Poland");
        assertEquals("PL", result.getCode());
    }

    @Test
    void getCountryCode_ShouldThrowException_WhenCountryDoesNotExist() {
        assertThrows(EntityNotFoundException.class, () -> countryService.getCountryCode("France"));
    }

    @Test
    void getCountryCodes_ShouldReturnCodes_WhenCountriesExist() {
        List<String> names = List.of("Poland", "Germany");
        List<CountryCodeMappingDto> result = countryService.getCountryCodes(names);

        assertEquals(2, result.size());
        assertEquals("PL", result.get(0).getCode());
        assertEquals("DE", result.get(1).getCode());
    }

    @Test
    void getCountryCodes_ShouldReturnUnknown_WhenCountryDoesNotExist() {
        List<String> names = List.of("Unknownland");
        List<CountryCodeMappingDto> result = countryService.getCountryCodes(names);

        assertEquals(1, result.size());
        assertEquals("unknown", result.getFirst().getCode());
    }

    @Test
    void getCountryCodes_ShouldThrowException_WhenCountryNamesIsNull() {
        assertThrows(IllegalArgumentException.class, () -> countryService.getCountryCodes(null));
    }

    @Test
    void getCountryCodes_ShouldThrowException_WhenCountryNamesIsEmpty() {
        assertThrows(IllegalArgumentException.class, () -> countryService.getCountryCodes(new ArrayList<>()));
    }
}