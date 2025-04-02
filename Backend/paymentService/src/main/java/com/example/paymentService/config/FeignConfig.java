//package com.example.paymentService.config;
//
//import feign.RequestInterceptor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
//
//@Slf4j
//@Configuration
//public class FeignConfig {
//
//    @Bean
//    public RequestInterceptor requestInterceptor() {
//        return requestTemplate -> {
//            String token = getCurrentToken();
//            log.info("token cc {}", token);
//            if (token != null) {
//                requestTemplate.header("Authorization", "Bearer " + token);
//            }
//        };
//    }
//
//    private String getCurrentToken() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof JwtAuthenticationToken) {
//            JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
//
//            log.info("token ne em", jwtToken.getToken().getTokenValue());
//            return jwtToken.getToken().getTokenValue();
//        }
//        return null;
//    }
//}
