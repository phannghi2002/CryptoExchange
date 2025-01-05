package com.example.apiGateway.config;

import com.example.apiGateway.dto.response.ApiResponse;
import com.example.apiGateway.service.IdentityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {

    IdentityService identityService;
    ObjectMapper objectMapper;

    @NonFinal
    String[] publicEndpoint = {
            "/identity/oauth2/.*",
            "/identity/login/.*",
            "/identity/auth/.*",
            "/identity/users/registration",
            "/ai/.*",
            "/coin/.*"

    };

    @Value("${app.api-prefix}")
    @NonFinal
    private String apiPrefix;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("enter authentication filter ...");

        if (isPublicEndpoint(exchange.getRequest())) {
            log.info("can deo gi phai xac thuc ...");
            return chain.filter(exchange);
        }
        log.info("bat xac thuc nhen con ...");
        // Get the Authorization header as a list of strings
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);

        // Check if the Authorization header exists and is not empty
        if (CollectionUtils.isEmpty(authHeader)) {
            return unauthenticated(exchange.getResponse());
        }

        // Get the first value from the Authorization header list
        String token = authHeader.get(0).replace("Bearer ", "");
        log.info("Token {}", token);

        // Verify the token using the identity service
        return identityService.introspect(token).flatMap(introspectResponse -> {
            // Proceed to the next filter if the token is valid
            if (introspectResponse.getResult().isValid()) {
                log.info("chay vo r");
                return chain.filter(exchange);
            } else {
                log.info("khong cho xac thuc");
                return unauthenticated(exchange.getResponse());
            }
        }).onErrorResume(throwable -> unauthenticated(exchange.getResponse()));
    }


    //ham nay dung de xep thu tu uu tien cua GlobalFilter, cang nho thi do uu tien cang lon
    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        return Arrays.stream(publicEndpoint)
                .anyMatch(s -> request.getURI().getPath().matches(apiPrefix + s));
    }

    //ham nay dung de tra ve loi 401 va in ra ket qua gom ma code va message
    Mono<Void> unauthenticated(ServerHttpResponse response) {
        // cai nay chinh la ket qua tra ve khi ta request
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(1401)
                .message("Unauthenticated")
                .build();

        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        //cai nay la trang thai hien ma code cua response
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        //cai nay la gia tri trong phan headers, nay co the xem trong postman
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
