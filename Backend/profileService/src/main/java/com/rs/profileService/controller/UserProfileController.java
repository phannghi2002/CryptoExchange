package com.rs.profileService.controller;


import com.rs.profileService.dto.request.ProfileCreationRequest;
import com.rs.profileService.dto.request.UserUpdateRequest;
import com.rs.profileService.dto.response.UserProfileResponse;
import com.rs.profileService.entity.UserProfile;
import com.rs.profileService.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileController {
    UserProfileService userProfileService;

    //cai nay dung de cac microservice tuong tac goi voi nhau khong can nguoi dung goi den
    @PostMapping("/users")
    UserProfileResponse createProfile(@RequestBody ProfileCreationRequest request) {
        return userProfileService.createProfile(request);
    }

    @GetMapping("/users/{profileId}")
    UserProfileResponse getProfile(@PathVariable String profileId) {
        return userProfileService.getProfile(profileId);
    }

    @GetMapping("/users")
    List<UserProfileResponse> getAllProfile() {
        return userProfileService.getAllProfile();
    }


    @GetMapping("/my-info")
    Optional<UserProfile> getMyInfo() {
        return userProfileService.getMyInfo();
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<String> deleteUser(@PathVariable String profileId) {
        userProfileService.deleteUserProfile(profileId);
        return ResponseEntity.ok("User has been deleted");
    }

    @PutMapping("/{profileId}")
    UserProfile updateUser(@PathVariable String profileId, @RequestBody UserUpdateRequest request) {
        return userProfileService.updateUserProfile(profileId, request);

    }

    @PutMapping("/updateMine")
    UserProfile updateUserMine( @RequestBody UserUpdateRequest request) {
        return userProfileService.updateUserProfileMine(request);
    }
}
