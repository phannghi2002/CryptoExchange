package com.example.chatAIService.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FunctionResponse {
    private String currencyName;
    private String functionName;
    private String currencyData;
}
