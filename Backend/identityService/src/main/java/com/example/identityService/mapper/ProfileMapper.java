package com.example.identityService.mapper;


import com.example.identityService.dto.request.ProfileCreationRequest;
import com.example.identityService.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileCreationRequest toProfileCreationRequest(UserCreationRequest request);
}
