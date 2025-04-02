package com.example.coinService.service;

import com.example.coinService.helper.RestTemplateHelper;
import com.example.coinService.modal.MarketChart;
import com.example.coinService.repository.MarketChartRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MarketChartService {
    @Autowired
    private MarketChartRepository marketChartRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${url}")
    private String baseUrl;

    public Optional<MarketChart> setValue(String coinId, int days) throws Exception {
        String url = baseUrl + "/" + coinId + "/market_chart?vs_currency=usd&days=" + days;

        try {
            // Fetch API response
            JsonNode root = RestTemplateHelper.makeApiCall(url, new TypeReference<JsonNode>() {});

            JsonNode pricesNode = root.get("prices");

            if (pricesNode.isArray()) {
                // Parse prices if it is an array
                List<List<Double>> prices = objectMapper.convertValue(pricesNode, new TypeReference<List<List<Double>>>() {});

                // Update MarketChart
                MarketChart marketChart = marketChartRepository.findById(coinId).orElse(new MarketChart());
                marketChart.setId(coinId);

                switch (days) {
                    case 1 -> marketChart.setPrices1days(prices);
                    case 7 -> marketChart.setPrices7days(prices);
                    case 30 -> marketChart.setPrices30days(prices);
                    case 365 -> marketChart.setPrices365days(prices);
                    default -> throw new IllegalArgumentException("Unsupported 'days' value: " + days);
                }

                marketChartRepository.save(marketChart);
                return Optional.of(marketChart);
            } else {
                throw new IllegalArgumentException("'prices' is not an array in the response");
            }

        } catch (Exception e) {
            // Log unexpected errors and fallback
            System.err.println("Unexpected error: " + e.getMessage());
            return marketChartRepository.findById(coinId);
        }
    }

    public List<Double> getFirst100Prices1Day(String coinId) {
        MarketChart marketChart = marketChartRepository.findById(coinId).orElse(null);
        if (marketChart != null && marketChart.getPrices1days() != null) {
            return marketChart.getPrices1days().stream()
                    .limit(100)  // Lấy 50 phần tử đầu tiên
                    .map(price -> price.get(1))  // Chỉ lấy giá trị thứ hai (giá)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();  // Trả về danh sách rỗng nếu không tìm thấy
    }

}




