package com.example.userService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
////        return http
////                .authorizeHttpRequests(auth -> {
////                    auth.requestMatchers("/").permitAll();
////                    auth.anyRequest().authenticated();
////                })
////                .oauth2Login(withDefaults())
////                .formLogin(withDefaults())
////                .build();
//
//        return http
//                .authorizeHttpRequests(auth -> {
//                    auth.requestMatchers("/", "/login**", "/oauth2/**").permitAll(); // Allow OAuth2 endpoints
//                    auth.anyRequest().authenticated();
//                })
//                .oauth2Login(oauth2 -> oauth2
//                        .loginPage("/login")  // Optional: Custom login page
//                        .defaultSuccessUrl("/home", true) // Redirect after successful login
//                )
//                .build();
//    }
//}


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/", "/login**", "/oauth2/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .defaultSuccessUrl("http://localhost:3000/home", true) // Redirect back to frontend after login
                )
                .cors(withDefaults()) // Enable CORS
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
