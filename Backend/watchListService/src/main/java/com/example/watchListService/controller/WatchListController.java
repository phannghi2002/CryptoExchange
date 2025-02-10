package com.example.watchListService.controller;

import com.example.watchListService.entity.WatchList;
import com.example.watchListService.service.WatchListService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController()
public class WatchListController {
    @Autowired
    private WatchListService watchListService;

    @PostMapping("/toggle")
    public ResponseEntity<WatchList> toggleWatchList(@RequestParam String coinId) {
        WatchList watchList = watchListService.toggleWatchList(coinId);
        return ResponseEntity.ok(watchList);
    }

    @GetMapping("/getCoinIds")
    public ResponseEntity<List<String>> getCoinIds() {
        log.info("getCoinIds");
        List<String> coinIds = watchListService.getCoinIdsByUserId();
        return ResponseEntity.ok(coinIds);
    }
}
