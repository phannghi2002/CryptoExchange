package com.example.ordersService.dto.request;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    String userId;
    String coin;
    double amount;
    double price;
    List<PaymentMethod> paymentMethods;
    int paymentTimeLimit; // Thời gian thanh toán tối đa (15 hoặc 20 phút)
    BigDecimal minimum;
    BigDecimal maximum;
}
