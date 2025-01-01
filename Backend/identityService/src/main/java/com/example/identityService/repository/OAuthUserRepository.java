package com.example.identityService.repository;

import com.example.identityService.entity.OAuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthUserRepository extends JpaRepository<OAuthUser, String> {
    Optional<OAuthUser> findByProviderAndProviderId(String provider, String providerId);

    Optional<OAuthUser> findByEmail(String email);
}
