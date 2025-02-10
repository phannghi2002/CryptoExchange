package com.example.identityService.service;

import com.example.identityService.dto.response.EmailResponse;
import com.example.identityService.exception.AppException;
import com.example.identityService.exception.ErrorCode;
import com.example.sharedLibrary.EmailTemplate;
import com.example.sharedLibrary.NotificationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;

@Slf4j
@Service
public class CommonService  {

    @Autowired
    private OtpService otpService;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public EmailResponse getEmail() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        return EmailResponse.builder().email(name).build();
    }

    public String randomCode() {
        // Sử dụng Random để sinh số ngẫu nhiên từ 100000 đến 999999
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 900000 = (999999 - 100000 + 1)

        // Chuyển số nguyên thành chuỗi và trả về
        return String.valueOf(code);
    }

    public void sendEmailTwoAuth(String email) {

        // Tạo mã OTP
        String code = randomCode();
        log.info("in ra code , email", code , email);

        // Lưu mã OTP vào Redis với TTL là 5 phút (300 giây)
        otpService.saveOtp(email, "TWO_FACTOR_AUTH", code, 300);

        // Tạo thông báo gửi qua Kafka
        Map<String, Object> param = Map.of("code", code);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("EMAIL")
                .recipient(email)
                .template(EmailTemplate.TWO_FACTOR_AUTH)
                .param(param)
                .build();

        // Gửi thông báo qua Kafka
        kafkaTemplate.send("notification-delivery", notificationEvent);
    }

}



