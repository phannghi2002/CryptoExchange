package com.example.identityService.service;

import com.example.identityService.entity.OAuthUser;
import com.example.identityService.entity.Role;
import com.example.identityService.repository.OAuthUserRepository;
import com.example.identityService.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Set;


import java.util.Collections;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private OAuthUserRepository oAuthUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        // Lấy thông tin email từ OAuth2
        String email = oAuth2User.getAttribute("email");
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");

        // Kiểm tra người dùng đã tồn tại chưa
        OAuthUser user = oAuthUserRepository.findByEmail(email)
                .orElseGet(() -> createOAuthUser(email, provider, providerId));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "email"
        );
    }

    // Tạo người dùng mới nếu chưa tồn tại
    private OAuthUser createOAuthUser(String email, String provider, String providerId) {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        OAuthUser newUser = new OAuthUser();
        newUser.setEmail(email);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setRoles(Set.of(userRole)); // Gán vai trò mặc định

        return oAuthUserRepository.save(newUser);
    }
}

