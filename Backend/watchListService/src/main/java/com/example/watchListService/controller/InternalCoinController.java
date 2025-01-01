package com.example.watchListService.controller;

import com.example.watchListService.dto.response.ApiResponse;
import com.example.watchListService.dto.response.CoinResponse;
import com.example.watchListService.service.WatchListService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalCoinController {
    WatchListService watchListService;

    @GetMapping("/internal/coins")
    public ResponseEntity<List<CoinResponse>> getCoinsInWatchList() {
        List<CoinResponse> response = watchListService.getCoinsInWatchList();
        return ResponseEntity.ok(response);
    }
}
