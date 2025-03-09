package com.example.ordersService.repository.httpclient;


import com.example.ordersService.dto.request.WalletUpdateTradeRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name="wallet-service", url="${app.services.wallet}")
public interface WalletClient {
    @PostMapping(value = "/updateTrade", produces = MediaType.APPLICATION_JSON_VALUE)
    void updateWalletTrade(@RequestBody WalletUpdateTradeRequest request);
}