package com.example.ordersService.dto.request;

import com.example.ordersService.constant.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubOrderRequest {
    String buyerId;
    double amount;
    PaymentMethod paymentMethods;

}
