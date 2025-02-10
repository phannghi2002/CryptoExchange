package com.example.identityService.config;

import com.example.identityService.handler.OAuth2SuccessHandler;
import com.example.identityService.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/users/registration","/users/forgotPassword","/users/updatePassword", "/auth/token", "/auth/introspect", "/auth/logout", "/auth/refresh",
            "/internal/users", "/login/oauth2/**", "/error","/auth/home","/oauth2/**", "/auth/checkOTP", "/auth/welcome"
    };

    private final CustomJwtDecoder customJwtDecoder;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder,
                          OAuth2SuccessHandler oAuth2SuccessHandler,
                          CustomOAuth2UserService customOAuth2UserService) {
        this.customJwtDecoder = customJwtDecoder;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.customOAuth2UserService = customOAuth2UserService;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                //.cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Cấu hình CORS tại đây
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()  // Các endpoint công khai
                        .anyRequest().authenticated()  // Các yêu cầu còn lại cần phải đăng nhập
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint
                                .baseUri("/oauth2/authorization")  // Endpoint yêu cầu OAuth2 authorization
                        )
                        .redirectionEndpoint(endpoint -> endpoint
                                .baseUri("/login/oauth2/code/*")  // Đường dẫn callback từ provider
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))  // Cung cấp OAuth2 user service của bạn
                        .successHandler(oAuth2SuccessHandler)  // Xử lý khi login thành công
//                        .defaultSuccessUrl("http://localhost:5173/overview", true)
                )
                .formLogin(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)  // Tắt CSRF nếu cần
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder)  // Cấu hình JWT decoder
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())  // JWT converter
                        )
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint())  // Xử lý lỗi xác thực JWT
                );

        return httpSecurity.build();
    }


    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }


}
