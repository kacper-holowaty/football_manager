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
public class Achievement {

    @Id
    @GeneratedValue
    private UUID achievementId;

    private String name;

    private LocalDate date;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;
}