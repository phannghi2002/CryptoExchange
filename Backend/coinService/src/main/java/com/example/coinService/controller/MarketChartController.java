package com.example.coinService.controller;

import com.example.coinService.modal.Coin;
import com.example.coinService.modal.MarketChart;
import com.example.coinService.service.CoinService;
import com.example.coinService.service.MarketChartService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/market")
public class MarketChartController {
    @Autowired
    private MarketChartService marketChartService;

    @Autowired
    ObjectMapper objectMapper;

    @GetMapping("/{coinId}")
    public ResponseEntity<MarketChart> getMarketChart(
            @PathVariable String coinId,
            @RequestParam("day") int day) throws Exception {

        // Call the service to get the market chart data
        Optional<MarketChart> marketChart = marketChartService.setValue(coinId, day);

        // Check if the market chart is present and return appropriate response
        if (marketChart.isPresent()) {
            return new ResponseEntity<>(marketChart.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if data not found
        }
    }

    @GetMapping("/price1day/{coinId}")
    public ResponseEntity<List<Double>> getFirst100Prices1Day(@PathVariable String coinId) {
        List<Double> prices = marketChartService.getFirst100Prices1Day(coinId);
        return ResponseEntity.ok(prices);
    }

}
