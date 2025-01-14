package com.example.coinService.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@Document(collection = "coin")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coin {
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


    public void setCurrent_price(double current_price) {
        this.current_price = new BigDecimal(current_price)
                .setScale(3, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public void setPrice_change_percentage_24h(double price_change_percentage_24h) {
        this.price_change_percentage_24h = new BigDecimal(price_change_percentage_24h)
                .setScale(3, RoundingMode.HALF_UP)
                .doubleValue();
    }

}

