package com.example.ordersService.repository.httpclient;


import com.example.ordersService.dto.request.ChangeCoinRequest;
import com.example.ordersService.dto.request.WalletUpdateTradeRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name="wallet-service", url="${app.services.wallet}")
public interface WalletClient {
    @PostMapping(value = "/internal/updateTrade", produces = MediaType.APPLICATION_JSON_VALUE)
    void updateWalletTrade(@RequestBody WalletUpdateTradeRequest request);

    @PutMapping(value = "/internal/substract-coin/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    void substractCoinWallet(@PathVariable String userId, @RequestBody ChangeCoinRequest request);

    @PutMapping(value = "/internal/add-coin/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    void addCoinWallet(@PathVariable String userId, @RequestBody ChangeCoinRequest request);
}