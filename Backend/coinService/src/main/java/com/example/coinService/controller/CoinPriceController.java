package com.example.coinService.controller;

import com.example.coinService.modal.Coin;
import com.example.coinService.updatePrice.CoinPriceUpdater;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
public class CoinPriceController {

    private final CoinPriceUpdater coinPriceUpdater;

    @Autowired
    public CoinPriceController(CoinPriceUpdater coinPriceUpdater) {
        this.coinPriceUpdater = coinPriceUpdater;
    }

    @GetMapping("/sse/coin-price")
    public SseEmitter streamCoinPrice(@RequestParam("page") int page,
                                      @RequestParam("category") String category,
                                      @RequestParam(value = "keyword", required = false) String keyword,
                                      @RequestParam("connectionId") String connectionId) {
        SseEmitter emitter = new SseEmitter(0L); // Không có giới hạn thời gian chờ

        // Map lưu trữ kết nối theo connectionId
        Map<String, SseEmitter> connectionMap = new ConcurrentHashMap<>();

        connectionMap.put(connectionId, emitter);

        boolean[] isRunning = {true};

        // Lắng nghe khi kết nối bị đóng hoặc hoàn tất
        emitter.onCompletion(() -> {
            isRunning[0] = false;
            connectionMap.remove(connectionId);
        });
        emitter.onTimeout(() -> {
            isRunning[0] = false;
            connectionMap.remove(connectionId);
        });
        emitter.onError((ex) -> {
            isRunning[0] = false;
            connectionMap.remove(connectionId);
        });

        // Tạo một thread để gửi dữ liệu mỗi giây
        new Thread(() -> {
            try {
                while (isRunning[0]) {
                    // Gửi thông báo giữ kết nối
                    emitter.send(SseEmitter.event().data("keep-alive"));

                    List<Coin> updatedCoins = List.of();
                    if ("all".equalsIgnoreCase(category)) {
                        updatedCoins = coinPriceUpdater.updateCoinPrices(page, 10);
                    } else if ("top50".equalsIgnoreCase(category)) {
                        updatedCoins = coinPriceUpdater.updateCoinTop50();
                    } else if("topGainers".equalsIgnoreCase(category)){
                        updatedCoins = coinPriceUpdater.updateCoinTopGainers();
                    }else if("topLosers".equalsIgnoreCase(category)){
                        updatedCoins = coinPriceUpdater.updateCoinTopLosers();
                    }
                    else if ("searchCoin".equalsIgnoreCase(category) && keyword != null) {
                        Optional<List<Coin>> coinsOptional = coinPriceUpdater.updateCoinTopSearch(keyword);
                        updatedCoins = coinsOptional.orElse(Collections.emptyList());
                    }


                    emitter.send(SseEmitter.event().name("coins").data(updatedCoins));

                    Thread.sleep(5000); // Chờ 5 giây trước khi gửi dữ liệu mới
                }
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

}

