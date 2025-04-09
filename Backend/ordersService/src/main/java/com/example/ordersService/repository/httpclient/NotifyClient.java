package com.example.ordersService.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name="notify-service", url="${app.services.notify}")
public interface NotifyClient {
    @PutMapping(value = "/{id}/handle-notify", produces = MediaType.APPLICATION_JSON_VALUE)
    void markNotificationAsHandleNotify(@PathVariable String id);
}