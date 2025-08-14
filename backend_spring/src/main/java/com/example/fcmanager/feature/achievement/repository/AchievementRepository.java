package com.example.fcmanager.feature.achievement.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fcmanager.feature.achievement.domain.Achievement;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
    List<Achievement> findByClub_ClubId(UUID clubClubId);
}
