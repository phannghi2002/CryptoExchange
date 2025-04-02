package com.example.transactionService.dto.request;

import com.example.transactionService.constant.Status;
import com.example.transactionService.constant.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionSwapOrderLimitRequest {
    String userId;
    String originCoin;
    BigDecimal originAmount;
    String targetCoin;
    BigDecimal targetAmount;
    Status status;
    Type type;
    BigDecimal total;
    String pair;
}

