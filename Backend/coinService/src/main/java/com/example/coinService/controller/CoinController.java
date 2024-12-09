package com.example.coinService.controller;

import com.example.coinService.modal.Coin;
import com.example.coinService.service.CoinService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/coins")
public class CoinController {
    private static final Logger log = LoggerFactory.getLogger(CoinController.class);
    @Autowired
    private CoinService coinService;

    @Autowired
    ObjectMapper objectMapper;

    @GetMapping("/all")
    ResponseEntity<List<Coin>> getCoinAll() throws Exception {
        List<Coin> coins = coinService.getCoinAll();
        return new ResponseEntity<>(coins, HttpStatus.ACCEPTED);
    }

    @GetMapping()
    ResponseEntity<List<Coin>> getCoinList(@RequestParam("page") int page) throws Exception {
        List<Coin> coins = coinService.getPaginatedCoins(page, 10);
        return new ResponseEntity<>(coins, HttpStatus.ACCEPTED);
    }

    @GetMapping("/top50")
    ResponseEntity<List<Coin>> getTop50CoinByMarketCapRank() throws Exception {
        List<Coin> top50coin = coinService.getTop50();
        return ResponseEntity.ok(top50coin);
    }

    @GetMapping("/topGainers")
    ResponseEntity<List<Coin>> getTopGainers() throws Exception {
        List<Coin> coins = coinService.getTopGainers();
        return new ResponseEntity<>(coins, HttpStatus.ACCEPTED);
    }

    @GetMapping("/topLosers")
    ResponseEntity<List<Coin>> getTopLosers() throws Exception {
        List<Coin> coins = coinService.getTopLosers();
        return new ResponseEntity<>(coins, HttpStatus.ACCEPTED);
    }

    @GetMapping("/details/{coinId}")
    ResponseEntity<Coin> getCoinDetails(@PathVariable String coinId) throws Exception {
        Coin coin = coinService.findById(coinId);
        log.info("hinh nhu no khong goi m thi phai"+ coin);
        return new ResponseEntity<>(coin, HttpStatus.ACCEPTED);
    }

    @GetMapping("/search")
    ResponseEntity<Optional<List<Coin>>> searchCoin(@RequestParam("q") String keyword) throws Exception {
        Optional<List<Coin>> coins = coinService.searchCoin(keyword);

        return new ResponseEntity<>(coins, HttpStatus.ACCEPTED);
    }
}


