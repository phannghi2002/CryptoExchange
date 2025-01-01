package com.example.chatAIService.service;

import com.example.chatAIService.dto.CoinDto;
import com.example.chatAIService.response.ApiResponse;


import com.example.chatAIService.response.FunctionResponse;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@Slf4j
@Service
public class ChatBotService {
    String GEMINI_API_KEY = "AIzaSyBJhVf2Td4TGY8Ps42VswuzoOiXhKS2u08";

    private Double getDoubleValue(Object value) {
        if (value instanceof Double) {
            return (Double) value;
        }
        if (value instanceof String) {
            return Double.parseDouble((String) value);
        }
        return null; // or throw an exception if the value is null/invalid
    }

    private Long getLongValue(Object value) {
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Integer) {
            return ((Integer) value).longValue(); // Convert Integer to Long
        }
        if (value instanceof String) {
            return Long.parseLong((String) value);
        }
        return null;
    }

    private Integer getIntegerValue(Object value) {
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof String) {
            return Integer.parseInt((String) value);
        }
        return null;
    }

    public CoinDto makeApiRequest(String currencyName) throws Exception {
        String url = "http://localhost:8081/coin/details/" + currencyName;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();

        if (responseBody != null) {
            log.info("ma kho chiu vo cung" + responseBody);
            return CoinDto.builder()
                    .id(String.valueOf(responseBody.get("id"))) // Convert to String
                    .symbol(String.valueOf(responseBody.get("symbol")))
                    .name(String.valueOf(responseBody.get("name")))
                    .image(String.valueOf(responseBody.get("image")))
                    .current_price(getDoubleValue(responseBody.get("current_price"))) // Convert to Double
                    .market_cap(getLongValue(responseBody.get("market_cap")))         // Convert to Long
                    .market_cap_rank(getIntegerValue(responseBody.get("market_cap_rank"))) // Convert to Integer
                    .high_24h(getDoubleValue(responseBody.get("high_24h")))
                    .low_24h(getDoubleValue(responseBody.get("low_24h")))
                    .circulating_supply(getLongValue(responseBody.get("circulating_supply")))
                    .total_supply(getIntegerValue(responseBody.get("total_supply")))
                    .max_supply(getIntegerValue(responseBody.get("max_supply")))
                    .total_volume(getLongValue(responseBody.get("total_volume")))
                    .price_change_24h(getDoubleValue(responseBody.get("price_change_24h")))
                    .price_change_percentage_24h(getDoubleValue(responseBody.get("price_change_percentage_24h")))
                    .build();
        }

        throw new Exception("Coin not found");
    }

    public ApiResponse getCoinDetails(String prompt) throws Exception {

        FunctionResponse res = getFunctionResponse(prompt);

        CoinDto apiResponse = makeApiRequest(res.getCurrencyName().toLowerCase());

        log.info("in cai nay tao xem nao" + apiResponse);

        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)
                                        )
                                )
                        )
                        .put(new JSONObject()
                                .put("role", "model")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionCall", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("args", new JSONObject()
                                                                .put("currencyName", res.getCurrencyName())
                                                                .put("currencyData", res.getCurrencyData())
                                                        )
                                                )
                                        )
                                )
                        )
                        .put(new JSONObject()
                                .put("role", "function")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionResponse", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("response", new JSONObject()
                                                                .put("name", "getCoinDetails")
                                                                .put("content", apiResponse)
                                                        )
                                                )
                                        )
                                )
                        )
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject()
                                .put("functionDeclarations", new JSONArray()
                                        .put(new JSONObject()
                                                .put("name", "getCoinDetails")
                                                .put("description", "Get crypto currency data from given currency object.")
                                                .put("parameters", new JSONObject()
                                                        .put("type", "OBJECT")
                                                        .put("properties", new JSONObject()
                                                                .put("currencyName", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description", "Tên đồng tiền, " +
                                                                                "id, " +
                                                                                "symbol.")
                                                                )
                                                                .put("currencyData", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description", "Tên đồng tiền có id, " +
                                                                                "symbol, current price, " +
                                                                                "image, " +
                                                                                "market cap rank" +
                                                                                "market cap extra...")
                                                                )
                                                        )
                                                        .put("required", new JSONArray()
                                                                .put("currencyName")
                                                                .put("currencyData")
                                                        )
                                                )
                                        )
                                )

                        )
                )
                .toString();

        HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        String responseBody = response.getBody();
        log.info("responseBody2" + responseBody);

        JSONObject jsonObject = new JSONObject(responseBody);

        //Extract the first candidate
        JSONArray candidates = jsonObject.getJSONArray("candidates");
        JSONObject firstCandidate = candidates.getJSONObject(0);

        //Extract the text
        JSONObject content = firstCandidate.getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");
        JSONObject firstPart = parts.getJSONObject(0);
        String text = firstPart.getString("text");


        return ApiResponse.builder().message(text).build();
    }

    public String simpleChat(String prompt) {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String requestBody = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt))))).toString();

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        return response.getBody();

    }

    public FunctionResponse getFunctionResponse(String prompt) {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

        JSONObject requestBodyJson = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)
                                        )
                                )
                        )
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject()
                                .put("functionDeclarations", new JSONArray()
                                        .put(new JSONObject()
                                                .put("name", "getCoinDetails")
                                                .put("description", "Lấy thông tin chi tiết về đồng tiền mã hóa")
                                                .put("parameters", new JSONObject()
                                                        .put("type", "OBJECT")
                                                        .put("properties", new JSONObject()
                                                                .put("currencyName", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description", "Tên đồng tiền, " + "id, symbol.")
                                                                )
                                                                .put("currencyData", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description", "Dữ liệu đồng tiền mã hóa bao gồm: " +
                                                                                "id (Mã định danh), " +
                                                                                "symbol (Ký hiệu tiền), " +
                                                                                "name (Tên đồng tiền), " +
                                                                                "image (Hình ảnh), " +
                                                                                "current_price (Giá trị, giá cả, giá tiền hiện tại), " +
                                                                                "market_cap (Vốn hóa thị trường), " +
                                                                                "market_cap_rank (Xếp hạng thị trường, xếp hạng vị trí), " +
                                                                                "fully_diluted_valuation (Tổng vốn hóa pha loãng), " +
                                                                                "total_volume (Tổng khối lượng giao dịch), " +
                                                                                "high_24h (Giá cao nhất trong 24 giờ), " +
                                                                                "low_24h (Giá thấp nhất trong 24 giờ), " +
                                                                                "price_change_24h (Thay đổi giá trong 24 giờ), " +
                                                                                "price_change_percentage_24h (Phần trăm thay đổi giá trong 24 giờ), " +
                                                                                "market_cap_change_24h (Thay đổi vốn hóa thị trường trong 24 giờ), " +
                                                                                "market_cap_change_percentage_24h (Phần trăm thay đổi vốn hóa thị trường trong 24 giờ), " +
                                                                                "circulating_supply (Nguồn cung lưu hành), " +
                                                                                "total_supply (Tổng nguồn cung), " +
                                                                                "max_supply (Nguồn cung tối đa), " +
                                                                                "ath (Giá cao nhất mọi thời đại), " +
                                                                                "ath_change_percentage (Phần trăm thay đổi giá cao nhất mọi thời đại), " +
                                                                                "ath_date (Ngày đạt giá cao nhất mọi thời đại), " +
                                                                                "atl (Giá thấp nhất mọi thời đại), " +
                                                                                "atl_change_percentage (Phần trăm thay đổi giá thấp nhất mọi thời đại), " +
                                                                                "atl_date (Ngày đạt giá thấp nhất mọi thời đại), " +
                                                                                "last_updated (Thời gian cập nhật gần nhất)."
                                                                        )
                                                                )

                                                        )
                                                        .put("required", new JSONArray()
                                                                .put("currencyName")
                                                                .put("currencyData")
                                                        )
                                                )
                                        )
                                )
                        )
                );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        String responseBody = response.getBody();
        log.info("responseBody" + responseBody);

        JSONObject jsonObject = new JSONObject(responseBody);

        //Extract the first candidate
        JSONArray candidates = jsonObject.getJSONArray("candidates");
        JSONObject firstCandidate = candidates.getJSONObject(0);

        //Extract the function call details
        JSONObject content = firstCandidate.getJSONObject("content");
        JSONArray parts = content.getJSONArray("parts");
        JSONObject firstPart = parts.getJSONObject(0);
        JSONObject functionCall = firstPart.getJSONObject("functionCall");

        String functionName = functionCall.getString("name");
        JSONObject args = functionCall.getJSONObject("args");
        String currencyName = args.getString("currencyName");
        String currencyData = args.getString("currencyData");

        return FunctionResponse.builder()
                .functionName(functionName)
                .currencyData(currencyData)
                .currencyName(currencyName)
                .build();
    }
}
