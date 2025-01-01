package com.example.watchListService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class WatchListServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WatchListServiceApplication.class, args);
	}

}
