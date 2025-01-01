package com.rs.profileService.service;


import com.rs.profileService.dto.request.ProfileCreationRequest;
import com.rs.profileService.dto.request.UserUpdateRequest;
import com.rs.profileService.dto.response.UserProfileResponse;
import com.rs.profileService.entity.UserProfile;

import com.rs.profileService.mapper.UserProfileMapper;
import com.rs.profileService.repository.UserProfileRepository;
import com.rs.profileService.repository.httpclient.IdentityClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;
    IdentityClient identityClient;

    public UserProfileResponse createProfile(ProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')" )
    public UserProfileResponse getProfile(String profileId){
        UserProfile userProfile = userProfileRepository.findByProfileId(profileId).orElseThrow(()->new RuntimeException("Profile not found"));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')" )
    public List<UserProfileResponse> getAllProfile(){
        log.info("khong chay vao day");
        List<UserProfile> userProfile = userProfileRepository.getAllUsers();

        return userProfileMapper.toUserProfileResponseList(userProfile);
    }

    public String getUserIdFromToken (){
        var context = SecurityContextHolder.getContext();

        // Get the Authentication object
        var authentication = context.getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            // Cast the principal to Jwt
            Jwt jwt = (Jwt) authentication.getPrincipal();

            // Extract claims or other details from the Jwt
            String subject = jwt.getSubject(); // Typically the user identifier
            Map<String, Object> claims = jwt.getClaims(); // All claims

            // Use the information as needed
            log.info("Subject: " + subject);
            log.info("Claim: " + claims);

            return (String)claims.get("userId");
        } else {
            throw new IllegalStateException("No JWT token found in SecurityContext");
        }
    }

    public String getTokenFromSecurityContext() {
        var context = SecurityContextHolder.getContext();
        var authentication = context.getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return "Bearer " + jwt.getTokenValue();
        } else {
            throw new IllegalStateException("No JWT token found in SecurityContext");
        }
    }

    public Optional<UserProfile> getMyInfo() {
        String userId = getUserIdFromToken();
        return userProfileRepository.findByUserId(userId);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUserProfile(String profileId) {


        UserProfile userProfile = userProfileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User with ID " + profileId + " not found"));

        // Lấy token từ SecurityContext
        String token = getTokenFromSecurityContext();

        // Gọi đến Identity Service và truyền token qua header
        identityClient.deleteUserIdentity(userProfile.getUserId(), token);

        userProfileRepository.delete(userProfile);

    }


    @PreAuthorize("hasRole('ADMIN')")
    public UserProfile updateUserProfile(String profileId, UserUpdateRequest request) {
        UserProfile userProfile = userProfileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new RuntimeException("User with ID " + profileId + " not found"));

        userProfileMapper.updateUserProfile(userProfile, request);
        return userProfileRepository.save(userProfile);
    }

    @PreAuthorize("hasRole('USER')")
    public UserProfile updateUserProfileMine(UserUpdateRequest request) {
        String userId = getUserIdFromToken();
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        userProfileMapper.updateUserProfile(userProfile, request);
        return userProfileRepository.save(userProfile);
    }
}
