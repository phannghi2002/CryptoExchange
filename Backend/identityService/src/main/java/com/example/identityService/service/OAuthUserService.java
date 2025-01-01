//package com.example.identityService.service;
//
//import com.example.identityService.constant.PredefinedRole;
//import com.example.identityService.entity.OAuthUser;
//import com.example.identityService.entity.Role;
//import com.example.identityService.repository.OAuthUserRepository;
//import com.example.identityService.repository.RoleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//import java.util.Set;
//
//@Service
//public class OAuthUserService {
//
//    @Autowired
//    private OAuthUserRepository oAuthUserRepository;
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    public OAuthUser processOAuthLogin(String provider, String providerId, String email) {
//        Optional<OAuthUser> existingUser = oAuthUserRepository.findByProviderAndProviderId(provider, providerId);
//
//        if (existingUser.isPresent()) {
//            return existingUser.get();
//        } else {
//            // Tìm hoặc tạo role USER
//            Role userRole = roleRepository.findByName("USER")
//                    .orElseGet(() -> {
//                        Role newRole = new Role();
//                        newRole.setName("USER");
//                        newRole.setDescription("Default user role");
//                        return roleRepository.save(newRole);
//                    });
//
//            OAuthUser newUser = new OAuthUser();
//            newUser.setEmail(email);
//            newUser.setProvider(provider);
//            newUser.setProviderId(providerId);
//            newUser.setRoles(Set.of(userRole));  // Gán vai trò mặc định
//            return oAuthUserRepository.save(newUser);
//        }
//    }
//}
//
