package com.example.fcmanager.domain;

import lombok.*;

import jakarta.persistence.*;
import java.util.List;
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

    private int houseNumber;

    private int apartmentNumber;

    private String postalCode;

    private String city;

    private String country;

    @OneToMany(mappedBy = "address", fetch = FetchType.LAZY)
    private List<Club> clubs;
}