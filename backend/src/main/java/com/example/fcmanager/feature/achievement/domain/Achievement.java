package com.example.fcmanager.feature.achievement.domain;

import com.example.fcmanager.feature.club.domain.Club;
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

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private Club club;
}