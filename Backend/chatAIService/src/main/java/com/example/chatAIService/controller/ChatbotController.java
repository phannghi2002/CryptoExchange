package com.example.chatAIService.controller;

import com.example.chatAIService.dto.PromptBody;
import com.example.chatAIService.response.ApiResponse;
import com.example.chatAIService.service.ChatBotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/ai/chat")
public class ChatbotController {
    @Autowired
    public ChatBotService chatBotService;

    @PostMapping()
    public ResponseEntity<ApiResponse> getCoinDetails(@RequestBody PromptBody prompt) throws Exception {
        ApiResponse apiResponse = chatBotService.getCoinDetails(prompt.getPrompt());
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/simple")
    public ResponseEntity<String> simpleChatHandler(@RequestBody PromptBody prompt) throws Exception {
        String response = chatBotService.simpleChat(prompt.getPrompt());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

