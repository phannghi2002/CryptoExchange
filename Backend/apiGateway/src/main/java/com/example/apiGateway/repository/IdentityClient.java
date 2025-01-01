package com.example.apiGateway.repository;

import com.example.apiGateway.dto.request.IntrospectRequest;
import com.example.apiGateway.dto.response.ApiResponse;
import com.example.apiGateway.dto.response.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;


//vi ta dung http client khac voi FeignClient nen ta can dang ky no voi HttpProxy dang ky trong
// WebClientConfiguration
//tim kiem PostExchange voi Spring boot
public interface IdentityClient {
    //nay la http client cua spring khong phai cua FeignClient, dung no thi ko can phai them dependency openfeign
    @PostExchange(url = "/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}