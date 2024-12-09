package com.example.coinService.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class RestTemplateHelper {

    @Value("${api-key.coingecko}")
    private static String API_KEY ;

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public static <T> T makeApiCall(String url, TypeReference<T> typeReference) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("accept", "application/json");
            headers.set("x-cg-pro-api-key", API_KEY);

            HttpEntity<String> entity = new HttpEntity<>("Parameters", headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // Deserialize response into the specified type
            return OBJECT_MAPPER.readValue(response.getBody(), typeReference);
        } catch (Exception e) {
            throw new Exception("Error during API call: " + e.getMessage());
        }
    }
}