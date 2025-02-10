package com.example.identityService.controller;

import com.example.identityService.dto.response.ApiResponse;
import com.example.identityService.dto.response.EmailResponse;
import com.example.identityService.dto.response.UserResponse;
import com.example.identityService.service.CommonService;
import com.example.sharedLibrary.EmailTemplate;
import com.example.sharedLibrary.NotificationEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/common")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommonController {
    CommonService commonService;

  KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping("/getEmail")
    ApiResponse<EmailResponse> getEmail() {
        return ApiResponse.<EmailResponse>builder()
                .result(commonService.getEmail())
                .build();
    }

    @PostMapping("/sendEmailTwoAuth")
    ApiResponse<String> sendEmailTwoAuth() {

        String email = commonService.getEmail().getEmail();
//        log.info("Email người dùng: {}", email);

        commonService.sendEmailTwoAuth(email);
        return ApiResponse.<String>builder()
                .result("Email đã được gửi đến ")
                .build();
    }
}
