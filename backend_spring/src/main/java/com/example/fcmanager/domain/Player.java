package com.example.fcmanager.domain;

import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID playerId;

    private String name;

    @Lob
    private byte[] photo;

    private LocalDate birthDate;

    private String nationality;

    private String position;

    private int shirtNumber;

    private LocalDate contractUntil;

    private int salary;

    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;
}