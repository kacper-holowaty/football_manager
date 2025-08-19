package com.example.fcmanager.feature.country.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class CountryCodesRequestDto {
    private List<String> countries;
}