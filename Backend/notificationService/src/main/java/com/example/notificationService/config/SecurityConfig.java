package com.example.notificationService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/email/send"
    };
    private final CustomJwtDecoder customJwtDecoder;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity.authorizeHttpRequests(request -> request
////                .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS)
////                .permitAll()
////                .anyRequest().authenticated());
//                .anyRequest().permitAll());
//        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
//                .decoder(customJwtDecoder)));
//
//
//        httpSecurity.csrf(AbstractHttpConfigurer::disable);
//
//        return httpSecurity.build();
//    }
//

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
//                .cors(cors -> cors.disable()) // Gateway xử lý CORS
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/ws/**","/internal/**").permitAll() // Miễn trừ /notification/ws/**
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)))
                .csrf(AbstractHttpConfigurer::disable);
        return httpSecurity.build();
    }
}
