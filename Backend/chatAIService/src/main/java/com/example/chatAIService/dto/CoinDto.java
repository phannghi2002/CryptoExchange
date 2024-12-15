package com.example.chatAIService.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoinDto {
    @Id
    private String id;
    private String symbol;
    private String name;
    private String image;
    private double current_price;
    private long market_cap;
    private int  market_cap_rank;
    private long fully_diluted_valuation;
    private long total_volume;
    private double high_24h;
    private double low_24h;
    private double price_change_24h;
    private double price_change_percentage_24h;
    private double market_cap_change_24h;
    private double market_cap_change_percentage_24h;
    private long circulating_supply;
    private long total_supply;
    private long max_supply;
    private double ath;
    private double ath_change_percentage;
    private Date ath_date;
    private double atl;
    private double atl_change_percentage;
    private Date atl_date;
    @JsonIgnore
    private String roi; // This is nullable
    private Date last_updated;
}