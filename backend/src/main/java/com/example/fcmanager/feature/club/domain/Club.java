package com.example.fcmanager.feature.club.domain;

import com.example.fcmanager.feature.player.domain.Player;
import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.achievement.domain.Achievement;
import com.example.fcmanager.feature.address.domain.Address;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID clubId;

    @Column(unique = true)
    private String name;

    @Lob
    private byte[] badge;

    private Integer foundedYear;

    private String stadiumName;

    private Integer stadiumCapacity;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Player> players;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Achievement> achievements;
}
