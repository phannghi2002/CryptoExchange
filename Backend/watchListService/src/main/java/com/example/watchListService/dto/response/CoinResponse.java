package com.example.watchListService.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CoinResponse {
    String id;
    String image;
    String name;
    String symbol;
    long total_volume;
    long market_cap;
    double price_change_percentage_24h;
    double current_price;
}
