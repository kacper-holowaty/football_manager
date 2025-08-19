package com.example.fcmanager.feature.user.repository;

import com.example.fcmanager.feature.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmailOrUsername(String email, String username);
    Optional<User> findByUsernameOrEmail(String username, String email);
}
