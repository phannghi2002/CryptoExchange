package com.example.apiGateway.config;

import com.example.apiGateway.repository.IdentityClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfiguration {
    @Bean
    WebClient identityWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8083/identity")
                .build();
    }

    @Bean
    IdentityClient identityClient(WebClient identityWebClient) {
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(identityWebClient))
                .build();
        return httpServiceProxyFactory.createClient(IdentityClient.class);
    }

//    @Bean
//    WebClient profileWebClient() {
//        return WebClient.builder()
//                .baseUrl("http://localhost:8084/profile") // Base URL for the Profile Service
//                .build();
//    }
//
//    @Bean
//    ProfileClient profileClient(WebClient profileWebClient) {
//        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
//                .builderFor(WebClientAdapter.create(profileWebClient))
//                .build();
//        return httpServiceProxyFactory.createClient(ProfileClient.class);
//    }
}
