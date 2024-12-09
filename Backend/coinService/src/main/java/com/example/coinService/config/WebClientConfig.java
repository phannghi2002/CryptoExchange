package com.example.coinService.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${api-key.coingecko}")
    private String API_KEY ;

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                .defaultHeader(HttpHeaders.ACCEPT, "application/json") // Add 'accept' header
                .defaultHeader("x-cg-pro-api-key", API_KEY) // Add API key header
                .build();
    }
}
