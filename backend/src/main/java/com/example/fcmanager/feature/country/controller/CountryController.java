package com.example.fcmanager.feature.country.controller;


import com.example.fcmanager.feature.country.domain.Country;
import com.example.fcmanager.feature.country.dto.CountryCodeMappingDto;
import com.example.fcmanager.feature.country.dto.CountryCodeResponseDto;
import com.example.fcmanager.feature.country.dto.CountryCodesRequestDto;
import com.example.fcmanager.feature.country.service.CountryService;
import com.example.fcmanager.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Country>>> getCountries() {
        List<Country> countries = countryService.getAllCountries();
        return ResponseEntity.ok(
                ApiResponse.success(countries, "Countries fetched successfully")
        );
    }

    @GetMapping("/{country}")
    public ResponseEntity<ApiResponse<CountryCodeResponseDto>> getCountry(@PathVariable String country) {
        CountryCodeResponseDto response = countryService.getCountryCode(country);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Country code fetched successfully")
        );
    }

    @PostMapping("/codes")
    public ResponseEntity<ApiResponse<List<CountryCodeMappingDto>>> getCountryCodes(
            @RequestBody CountryCodesRequestDto request) {

        List<CountryCodeMappingDto> result = countryService.getCountryCodes(request.getCountries());
        return ResponseEntity.ok(
                ApiResponse.success(result, "Country codes fetched successfully")
        );
    }
}