package com.example.fcmanager.feature.player.repository;

import com.example.fcmanager.feature.player.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {
    boolean existsByClub_ClubIdAndShirtNumber(UUID clubId, Integer shirtNumber);
    boolean existsByClub_ClubIdAndShirtNumberAndPlayerIdNot(UUID clubId, Integer shirtNumber, UUID playerId);
    List<Player> findByClubClubId(UUID clubId);
}
