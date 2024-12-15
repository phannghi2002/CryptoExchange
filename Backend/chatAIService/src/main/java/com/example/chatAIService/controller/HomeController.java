package com.example.chatAIService.controller;

import com.example.chatAIService.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class HomeController {
    @GetMapping("/")
    public ResponseEntity<ApiResponse> home() {
        return new ResponseEntity<>(ApiResponse.builder()
                .message("Welcome to AI chat").build(), HttpStatus.OK);
    }

}

