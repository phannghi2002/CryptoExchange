package com.example.identityService.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    public OtpService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveOtp(String email, String action, String otp, int ttlSeconds) {
        String key = String.format("OTP:%s:%s", action, email);
        redisTemplate.opsForValue().set(key, otp, ttlSeconds, TimeUnit.SECONDS);
    }

    public String getOtp(String email, String action) {
        String key = String.format("OTP:%s:%s", action, email);
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteOtp(String email, String action) {
        String key = String.format("OTP:%s:%s", action, email);
        redisTemplate.delete(key);
    }
}

