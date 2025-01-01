package com.rs.profileService.repository.httpclient;


import com.rs.profileService.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name="identity-service", url="${app.services.identity}")
public interface IdentityClient {
    @DeleteMapping(value = "/internal/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<String> deleteUserIdentity(@PathVariable String userId,
                                           @RequestHeader("Authorization") String token);
}
