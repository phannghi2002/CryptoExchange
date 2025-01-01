package com.rs.profileService.repository;

import com.rs.profileService.entity.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    @Query("MATCH (user:user_profile) RETURN user")
    List<UserProfile> getAllUsers();

    @Query("MATCH (u:user_profile) WHERE u.id = $id RETURN u")
    Optional<UserProfile> findByProfileId(@Param("id") String profileId);

    @Query("MATCH (userProfile:`user_profile`) WHERE userProfile.userId = $userId RETURN userProfile{.city, .dob, .firstName, .id, .lastName, .userId, __nodeLabels__: labels(userProfile), __elementId__: elementId(userProfile)}")
    Optional<UserProfile> findByUserId(String userId);

}
