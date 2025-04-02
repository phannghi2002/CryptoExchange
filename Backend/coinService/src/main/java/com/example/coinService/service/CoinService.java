package com.example.coinService.service;

import com.example.coinService.helper.RestTemplateHelper;
import com.example.coinService.modal.Coin;
import com.example.coinService.repository.CoinRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.swing.text.Document;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CoinService {
    @Autowired
    private CoinRepository coinRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${url}")
    private String baseUrl;

    public List<Coin> getCoinAll() throws Exception {
        // String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
        String url = baseUrl + "markets?vs_currency=usd";

        try {
            // Pass TypeReference to correctly resolve the generic type List<Coin>
            List<Coin> coinList = RestTemplateHelper.makeApiCall(url, new TypeReference<List<Coin>>() {});

            log.info("Saving coins to database: {}", coinList);

           // coinRepository.deleteAll(); // Delete existing data
            coinRepository.saveAll(coinList); // Save new data

            return coinList;
        } catch (Exception e) {
            log.error("Error fetching coins: {}", e.getMessage());
            return coinRepository.findAll(); // Fallback to database
        }

    }

    public List<Coin> getPaginatedCoins(int page, int size) throws Exception {
        List<Coin> allCoins = getCoinAll();

        // Fetch the data from MongoDB instead
        int startRank = page * size + 1;
        int endRank = startRank + size - 1;

        List<Coin> coins = coinRepository.findByMarketCapRankBetween(startRank, endRank);
        log.info("in coin ne {}", coins);
        return coins;
    }

    public List<Coin> getTopGainers() throws Exception {
        // Fetch all coins (either from the API or MongoDB)
        List<Coin> allCoins = getCoinAll();

        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "price_change_percentage_24h"));
        List<Coin> topCoins = coinRepository.findTop10ByPriceChangePercentage24hDesc(pageable);
        log.info("LOG6");
        return topCoins;
    }

    public List<Coin> getTopLosers() throws Exception {
        // Fetch all coins (either from the API or MongoDB)
        List<Coin> allCoins = getCoinAll();
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price_change_percentage_24h"));
        List<Coin> topCoins = coinRepository.findTop10ByPriceChangePercentage24hAsc(pageable);
        log.info("LOG7");
        return topCoins;
    }

    public Coin findById(String coinId) throws Exception {
        Optional<Coin> optionalCoin = coinRepository.findById(coinId);
        if (optionalCoin.isEmpty()) throw new Exception("Coin not found");

        return optionalCoin.get();
    }

    public Optional<List<Coin>> searchCoin(String keyword) throws Exception {
        Optional<List<Coin>> searchList = coinRepository.findCoinByIdOrSymbol(keyword);
        if (searchList.isEmpty()) throw new Exception("Coin not found");
        return Optional.of(searchList.get());
    }

    public List<Coin> getTop50() throws Exception {

        String url = baseUrl +  "markets?vs_currency=usd&per_page=50&page=1";
        try {
            List<Coin> coinTop50 = RestTemplateHelper.makeApiCall(url, new TypeReference<List<Coin>>() {});

            log.info("LOG10");

            return coinTop50;

        } catch (Exception e) { // Handle exception if the API call fails
            System.out.println("Error fetching data from CoinGecko API3: " + e.getMessage());
            log.info("LOG11");
            return coinRepository.findByMarketCapRankBetween(1, 50);
        }
    }

    public List<Coin> getCoinsByIds(List<String> coinIds) {
        return coinRepository.findByCoinIdIn(coinIds);
    }

//    public List<Coin> getCoinsByExchangeRate(List<String> coinIds) {
//        return coinRepository.findByCoinIdIn(coinIds);
//    }

    public Map<String, Double> getExchangeRates(List<String> symbols) {
        List<Coin> coins = coinRepository.findBySymbolInIgnoreCase(symbols);

        log.info("in coin {}", coins);

        // Lọc chỉ giữ 1 bản ghi duy nhất cho mỗi symbol, ưu tiên id = "tether"
        Map<String, Coin> uniqueCoins = coins.stream()
                .collect(Collectors.toMap(
                        coin -> coin.getSymbol().toUpperCase(), // key
                        coin -> coin, // value
                        (existing, replacement) -> {
                            // Ưu tiên bản ghi có id là "tether"
                            if ("tether".equalsIgnoreCase(existing.getId())) return existing;
                            if ("tether".equalsIgnoreCase(replacement.getId())) return replacement;
                            return existing; // giữ cái đầu tiên nếu cả hai đều không phải tether
                        }
                ));

        return uniqueCoins.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            double basePrice = entry.getValue().getCurrent_price();
                            double fluctuation = (Math.random() * 0.0002 - 0.0001) * basePrice; // ±0.01%
                            return BigDecimal.valueOf(basePrice + fluctuation)
                                    .setScale(3, RoundingMode.HALF_UP)
                                    .doubleValue();
                        }
                ));
    }






}
