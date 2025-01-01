package com.example.watchListService.service;

import com.example.watchListService.dto.response.ApiResponse;
import com.example.watchListService.dto.response.CoinResponse;
import com.example.watchListService.entity.WatchList;
import com.example.watchListService.repository.WatchListRepository;

import com.example.watchListService.repository.httpclient.CoinClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
public class WatchListService {
    @Autowired
    public WatchListRepository watchListRepository;

    @Autowired
    public CoinClient coinClient;

    public String getUserIdFromToken (){
        var context = SecurityContextHolder.getContext();

        // Get the Authentication object
        var authentication = context.getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            // Cast the principal to Jwt
            Jwt jwt = (Jwt) authentication.getPrincipal();

            // Extract claims or other details from the Jwt
            String subject = jwt.getSubject(); // Typically the user identifier
            Map<String, Object> claims = jwt.getClaims(); // All claims

            // Use the information as needed
            log.info("Subject: " + subject);
            log.info("Claim: " + claims);

            return (String)claims.get("userId");
        } else {
            throw new IllegalStateException("No JWT token found in SecurityContext");
        }
    }

    public WatchList toggleWatchList(String coinId) {

        String userId = getUserIdFromToken();

        // Kiểm tra xem watchlist của người dùng đã tồn tại chưa
        WatchList watchList = watchListRepository.findByUserId(userId)
                .orElse(WatchList.builder()
                        .userId(userId)
                        .coinIds(new ArrayList<>())
                        .build());

        watchList.setUserId(userId);

        // Nếu coin chưa tồn tại trong danh sách, thêm vào
        if (!watchList.getCoinIds().contains(coinId)) {
            watchList.getCoinIds().add(coinId);
        } else {
            watchList.getCoinIds().remove(coinId);
        }
        watchListRepository.save(watchList);
        return watchList;
    }

    public List<String> getCoinIdsByUserId() {

        String userId = getUserIdFromToken();
        // Find watchlist by userId
        WatchList watchList = watchListRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Watchlist not found for userId: " + userId));

        // Return the list of coinIds
        return watchList.getCoinIds();
    }

    public List<CoinResponse> getCoinsInWatchList() {
// 1. Lấy danh sách coinIds từ WatchList của người dùng
        List<String> coinIds = getCoinIdsByUserId();

        // 2. Nếu danh sách coinIds rỗng, trả về danh sách trống
        if (coinIds.isEmpty()) {
            return Collections.emptyList(); // Trả về danh sách rỗng thay vì ApiResponse
        }
        // 3. Nối các coinIds thành chuỗi, ngăn cách bởi dấu phẩy
        String idsParam = String.join(",", coinIds);

        // 4. Gọi CoinService với chuỗi ids
        List<CoinResponse> response = coinClient.getCoinByIds(idsParam);

        // 5. Kiểm tra kết quả trả về từ CoinService
        if (response == null) {
            throw new RuntimeException("Failed to fetch coins from CoinService");
        }

        // 6. Trả về danh sách các CoinResponse
        return response; // Trả về trực tiếp danh sách CoinResponse
    }

}
