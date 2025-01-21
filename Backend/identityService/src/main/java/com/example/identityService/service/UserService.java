package com.example.identityService.service;

import java.util.*;


//import com.example.event.dto.NotificationEvent;
//import com.example.identityService.constant.EmailTemplate;
import com.example.identityService.dto.response.ApiResponse;
import com.example.sharedLibrary.NotificationEvent;
import com.example.sharedLibrary.EmailTemplate;


import com.example.identityService.constant.PredefinedRole;
import com.example.identityService.dto.request.UserCreationRequest;
import com.example.identityService.dto.request.UserUpdateRequest;
import com.example.identityService.dto.response.UserResponse;
import com.example.identityService.entity.Role;
import com.example.identityService.entity.User;
import com.example.identityService.exception.AppException;
import com.example.identityService.exception.ErrorCode;
import com.example.identityService.mapper.ProfileMapper;
import com.example.identityService.mapper.UserMapper;
import com.example.identityService.repository.RoleRepository;
import com.example.identityService.repository.UserRepository;
import com.example.identityService.repository.httpclient.ProfileClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    ProfileClient profileClient;
    ProfileMapper profileMapper;

    KafkaTemplate<String, Object> kafkaTemplate;

    RedisTemplate redisTemplate;
    OtpService otpService;

    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);
        user = userRepository.save(user);

        var profileRequest = profileMapper.toProfileCreationRequest(request);
        profileRequest.setUserId(user.getId());

        //goi den cac controller in profile
        profileClient.createProfile(profileRequest);

        Map<String, Object> param = Map.of("name", profileRequest.getFirstName() + " " + profileRequest.getLastName());


        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .recipient(request.getEmail())
                .template(EmailTemplate.WELCOME_EMAIL)
                .param(param)
                .build();
        //publish message to kafka
        kafkaTemplate.send("notification-delivery", notificationEvent);

        return userMapper.toUserResponse(user);
    }

    public String randomCode() {
        // Sử dụng Random để sinh số ngẫu nhiên từ 100000 đến 999999
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 900000 = (999999 - 100000 + 1)

        // Chuyển số nguyên thành chuỗi và trả về
        return String.valueOf(code);
    }

//    public void forgotPassword(String email) {
//        if (!userRepository.existsByEmail(email)) throw new AppException(ErrorCode.USER_NOT_EXISTED);
//
//        String code = randomCode();
//        Map<String, Object> param = Map.of("code", code);
//
//        NotificationEvent notificationEvent = NotificationEvent.builder()
//                .channel("EMAIL")
//                .recipient(email)
//                .template(EmailTemplate.FORGOT_PASSWORD)
//                .param(param)
//                .build();
//        //publish message to kafka
//        kafkaTemplate.send("notification-delivery", notificationEvent);
//
//    }

    public void forgotPassword(String email) {
        // Kiểm tra xem email có tồn tại không
        if (!userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        // Tạo mã OTP
        String code = randomCode();

        // Lưu mã OTP vào Redis với TTL là 5 phút (300 giây)
        otpService.saveOtp(email, "FORGOT_PASSWORD", code, 300);

        // Tạo thông báo gửi qua Kafka
        Map<String, Object> param = Map.of("code", code);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .recipient(email)
                .template(EmailTemplate.FORGOT_PASSWORD)
                .param(param)
                .build();

        // Gửi thông báo qua Kafka
        kafkaTemplate.send("notification-delivery", notificationEvent);
    }

    public ApiResponse<Void> checkOTP(String email, String action, String otpCode) {
        String key = String.format("OTP:%s:%s", action, email);
        String storedOtp = (String) redisTemplate.opsForValue().get(key);
        log.info("max otp:{}", storedOtp);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_NOT_FOUND);
        }

        if (!storedOtp.equals(otpCode)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        redisTemplate.delete(key);
        return ApiResponse.<Void>builder()
                .message("OTP verified successfully")
                .build();
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByEmail(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }
}
