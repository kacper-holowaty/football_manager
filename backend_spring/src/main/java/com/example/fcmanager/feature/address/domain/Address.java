package com.example.fcmanager.feature.address.domain;

import com.example.fcmanager.feature.club.domain.Club;
import lombok.*;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID addressId;

    private String street;

    private String houseNumber;

    private String apartmentNumber;

    private String postalCode;

    private String city;

    private String country;

    @OneToOne(mappedBy = "address")
    private Club club;
}