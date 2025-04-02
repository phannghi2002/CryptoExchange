package com.example.ordersService.dto.request;

import com.example.ordersService.constant.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BankRequest {

    String userId;
    String nameBank;
    String numberAccount;
    String nameAccount;
    String contentPay;
}
