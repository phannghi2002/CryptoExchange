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
public class UpdateTransactionSwapOrderLimitRequest {
    Status status;
}

