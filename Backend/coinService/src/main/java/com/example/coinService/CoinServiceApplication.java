package com.example.coinService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.example.coinService.repository")
public class CoinServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoinServiceApplication.class, args);
	}

}
