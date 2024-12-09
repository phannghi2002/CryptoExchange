package com.example.coinService.modal;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "market_chart")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MarketChart {
    @Id
    private String id;

    private List<List<Double>> prices1days;  // List of [timestamp, price]
    private List<List<Double>> prices7days;  // List of [timestamp, price]
    private List<List<Double>> prices30days;
    private List<List<Double>> prices365days;  // List of [timestamp, price]

}
