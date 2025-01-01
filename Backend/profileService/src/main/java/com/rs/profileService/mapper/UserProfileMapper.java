package com.rs.profileService.mapper;

import com.rs.profileService.dto.request.ProfileCreationRequest;
import com.rs.profileService.dto.request.UserUpdateRequest;
import com.rs.profileService.dto.response.UserProfileResponse;
import com.rs.profileService.entity.UserProfile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;


@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(ProfileCreationRequest request);
    UserProfileResponse toUserProfileResponse(UserProfile entity);
    List<UserProfileResponse> toUserProfileResponseList(List<UserProfile> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserProfile updateUserProfile(@MappingTarget UserProfile user, UserUpdateRequest request);
}
