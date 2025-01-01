package com.example.chatAIService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.example.chatAIService")
public class ChatAiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatAiServiceApplication.class, args);
	}

}
