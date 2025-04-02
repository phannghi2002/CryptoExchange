package com.example.transactionService.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionSwapRequest {
    String userId;
    String originCoin;
    BigDecimal originAmount;
    BigDecimal originPrice;
    String targetCoin;
    BigDecimal targetAmount;
    BigDecimal targetPrice;
}

