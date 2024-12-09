package com.example.coinService.repository;

import com.example.coinService.modal.MarketChart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketChartRepository extends MongoRepository<MarketChart, String> {

}
