package com.example.chatAIService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PromptBody {
    private String prompt;
}
