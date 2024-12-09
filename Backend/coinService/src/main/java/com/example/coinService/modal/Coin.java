package com.example.coinService.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "coin")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coin {
//    @Id
//    private String id;
//
//    @Field("symbol")
//    private String symbol;
//
//    @Field("name")
//    private String name;
//
//    @Field("image")
//    private String image;
//
//    @Field("current_price")
//    private double currentPrice;
//
//    @Field("market_cap")
//    private long marketCap;
//
//    @Field("market_cap_rank")
//    private int marketCapRank;
//
//    @Field("fully_diluted_valuation")
//    private long fullyDilutedValuation;
//
//    @Field("total_volume")
//    private long totalVolume;
//
//    @Field("high_24h")
//    private double high24h;
//
//    @Field("low_24h")
//    private double low24h;
//
//    @Field("price_change_24h")
//    private double priceChange24h;
//
//    @Field("price_change_percentage_24h")
//    private double priceChangePercentage24h;
//
//    @Field("market_cap_change_24h")
//    private double marketCapChange24h;
//
//    @Field("market_cap_change_percentage_24h")
//    private double marketCapChangePercentage24h;
//
//    @Field("circulating_supply")
//    private long circulatingSupply;
//
//    @Field("total_supply")
//    private long totalSupply;
//
//    @Field("max_supply")
//    private long maxSupply;
//
//    @Field("ath")
//    private double ath;
//
//    @Field("ath_change_percentage")
//    private double athChangePercentage;
//
//    @Field("ath_date")
//    private Date athDate;
//
//    @Field("atl")
//    private double atl;
//
//    @Field("atl_change_percentage")
//    private double atlChangePercentage;
//
//    @Field("atl_date")
//    private Date atlDate;
//
//    @Field("roi")
//    @JsonIgnore
//    private String roi; // This is nullable
//
//    @Field("last_updated")
//    private Date lastUpdated;

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

