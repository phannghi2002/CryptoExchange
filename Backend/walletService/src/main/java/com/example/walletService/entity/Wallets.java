package com.example.walletService.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "wallets")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Wallets {
    @Id
    private String id;  // ID của wallet
    private String userId;  // ID của người dùng

    @org.springframework.data.mongodb.core.mapping.Field("fiat_balance")
    private Map<String, BigDecimal> fiatBalance = new HashMap<>(); // Nested map for fiat currencies (e.g., "VND": 5000000)

    @org.springframework.data.mongodb.core.mapping.Field("crypto_balance")
    private Map<String, BigDecimal> cryptoBalance = new HashMap<>(); // Nested map for cryptocurrencies (e.g., "USDT": 100.5, "BTC": 0.002)

    @org.springframework.data.mongodb.core.mapping.Field("created_at")
    private LocalDateTime createdAt;

    @org.springframework.data.mongodb.core.mapping.Field("updated_at")
    private LocalDateTime updatedAt;


}
