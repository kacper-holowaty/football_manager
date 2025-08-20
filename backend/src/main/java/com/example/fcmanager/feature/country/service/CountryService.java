package com.example.fcmanager.feature.country.service;

import com.example.fcmanager.feature.country.domain.Country;
import com.example.fcmanager.feature.country.dto.CountryCodeMappingDto;
import com.example.fcmanager.feature.country.dto.CountryCodeResponseDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CountryService {

    private List<Country> countries = new ArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void loadCountries() {
        try {
            ClassPathResource resource = new ClassPathResource("data/countries.json");
            countries = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<List<Country>>() {}
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to load countries data", e);
        }
    }

    public List<Country> getAllCountries() {
        return countries;
    }

    public CountryCodeResponseDto getCountryCode(String countryName) {
        Country country = findCountryByName(countryName);
        if (country == null) {
            throw new EntityNotFoundException("Country not found: " + countryName);
        }
        return new CountryCodeResponseDto(country.getCode());
    }

    public List<CountryCodeMappingDto> getCountryCodes(List<String> countryNames) {
        if (countryNames == null || countryNames.isEmpty()) {
            throw new IllegalArgumentException("Invalid request format. Provide an array of country names.");
        }

        return countryNames.stream()
                .map(countryName -> {
                    Country country = findCountryByName(countryName);
                    String code = country != null ? country.getCode() : "unknown";
                    return new CountryCodeMappingDto(countryName, code);
                })
                .toList();
    }

    private Country findCountryByName(String countryName) {
        return countries.stream()
                .filter(c -> c.getCountry().equalsIgnoreCase(countryName))
                .findFirst()
                .orElse(null);
    }
}