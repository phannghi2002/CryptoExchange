package com.example.identityService.service;

import com.example.identityService.dto.request.ProfileCreationRequest;
import com.example.identityService.dto.response.UserProfileResponse;
import com.example.identityService.dto.response.UserResponse;
import com.example.identityService.entity.OAuthUser;
import com.example.identityService.entity.Role;
import com.example.identityService.exception.AppException;
import com.example.identityService.exception.ErrorCode;
import com.example.identityService.mapper.UserMapper;
import com.example.identityService.repository.OAuthUserRepository;
import com.example.identityService.repository.RoleRepository;
import com.example.identityService.repository.httpclient.ProfileClient;
import com.example.sharedLibrary.EmailTemplate;
import com.example.sharedLibrary.NotificationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;



import java.util.Collections;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private OAuthUserRepository oAuthUserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProfileClient profileClient;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");

       // log.info("In tất cả thông tin nè {}", oAuth2User);
        String firstName= oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        LocalDate dob = extractDob(oAuth2User); // Ví dụ nếu có ngày sinh
        String city = oAuth2User.getAttribute("locale");

        OAuthUser user = oAuthUserRepository.findByEmail(email)
                .orElseGet(() -> createOAuthUser(email, provider, providerId, firstName, lastName, dob, city));

        return new DefaultOAuth2User(
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toSet()),
                oAuth2User.getAttributes(),
                "email"
        );
    }

    private OAuthUser createOAuthUser(String email, String provider, String providerId,
                                      String firstName, String lastName, LocalDate dob, String city) {


        OAuthUser newUser = new OAuthUser();
        newUser.setEmail(email);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setCreatedAt(LocalDateTime.now());

        // Nếu userRole có giá trị, chuyển đổi nó thành Set<Role>
        // Nếu không có giá trị, trả về Set<Role> rỗng
        Optional<Role> userRole = roleRepository.findByName("USER");
        newUser.setRoles(userRole.map(Collections::singleton).orElse(Collections.emptySet()));

        OAuthUser savedUser = oAuthUserRepository.save(newUser);

        // Gọi FeignClient để tạo profile trong profile-service
        ProfileCreationRequest profileOAuthUser = ProfileCreationRequest.builder()
                .userId(savedUser.getId())  // Lấy id của user vừa lưu
                .firstName(firstName)
                .lastName(lastName)
                .dob(dob)
                .city(city)
                .build();

        // Gửi request qua profile-service
        UserProfileResponse response = profileClient.createProfile(profileOAuthUser);
        log.info("Profile created with response: {}", response);

        //Gửi email chào mừng đến với nền tảng giao dịch
        Map<String, Object> param = Map.of("name", firstName + " " + lastName);

        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .recipient(email)
                .template(EmailTemplate.WELCOME_EMAIL)
                .param(param)
                .build();


        // Gửi thông báo qua Kafka
        kafkaTemplate.send("notification-delivery", notificationEvent);

        return savedUser;
    }

    // Hàm ví dụ để lấy DOB từ OAuth nếu có
    private LocalDate extractDob(OAuth2User oAuth2User) {
        String dobString = oAuth2User.getAttribute("birthdate");
        if (dobString != null) {
            return LocalDate.parse(dobString);
        }
        return null;
    }

    public UserResponse convert2FA() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        OAuthUser oAuthUser = oAuthUserRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Chuyển đổi trạng thái twoAuth
        oAuthUser.setTwoAuth(!Boolean.TRUE.equals(oAuthUser.getTwoAuth()));

        // Lưu thay đổi và trả về UserResponse
        OAuthUser updatedOAuthUser = oAuthUserRepository.save(oAuthUser);

        return userMapper.toOAuthUserResponse(updatedOAuthUser);
    }

}



