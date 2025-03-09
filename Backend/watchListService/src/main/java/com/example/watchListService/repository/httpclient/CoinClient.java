package com.example.watchListService.repository.httpclient;

import com.example.watchListService.dto.response.CoinResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="coin-service", url="${app.services.coin}")
public interface CoinClient {
    @GetMapping(value = "/listId", produces = MediaType.APPLICATION_JSON_VALUE)
    List<CoinResponse> getCoinByIds(@RequestParam("ids") String coinIds);
}
