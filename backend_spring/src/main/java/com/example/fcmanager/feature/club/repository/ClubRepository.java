package com.example.fcmanager.feature.club.repository;

import com.example.fcmanager.feature.club.domain.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClubRepository extends JpaRepository<Club, UUID> {
    boolean existsByName(String name);
    List<Club> findByUser_UserId(UUID userUserId);
}
