//package com.example.identityService.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
//import org.springframework.security.oauth2.client.registration.ClientRegistration;
//import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
//import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
//import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
//
//@Configuration
//public class OAuth2Config {
//
//    // Định nghĩa bean ClientRegistrationRepository
//    @Bean
//    public ClientRegistrationRepository clientRegistrationRepository() {
//        ClientRegistration googleClientRegistration = ClientRegistration.withRegistrationId("google")
//               
//
//        return new InMemoryClientRegistrationRepository(googleClientRegistration);
//    }
//
//}
