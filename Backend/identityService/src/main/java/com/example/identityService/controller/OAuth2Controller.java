package com.example.identityService.controller;

import com.example.identityService.dto.response.ApiResponse;
import com.example.identityService.dto.response.UserResponse;
import com.example.identityService.service.CustomOAuth2UserService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @GetMapping("/success")
    public ResponseEntity<?> getOAuthToken(@CookieValue(name = "OAUTH_TOKEN", required = false) String token,
                                           @CookieValue(name = "TWO_AUTH", required = false) String twoAuth) {

//        if (token != null) {
//            return ResponseEntity.ok(Collections.singletonMap("token", token));
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found");
//        }
        if (token != null) {
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("twoAuth", twoAuth != null ? twoAuth : "false");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found");
        }
    }

    @PutMapping("/convertTwoAuth")
    public ApiResponse<UserResponse> convert2FA() {
        UserResponse updatedUser = customOAuth2UserService.convert2FA();
        return ApiResponse.<UserResponse>builder()
                .result(updatedUser)
                .build();
    }
}
