package com.example.ordersService.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderNotifyResponse {
    String orderId;
    double priceVnd;
    String subOrderId;
    String buyerId;
    double amount;

}
