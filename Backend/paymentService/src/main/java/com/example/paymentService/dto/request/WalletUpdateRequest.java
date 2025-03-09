package com.example.paymentService.dto.request;


import com.example.paymentService.constant.Status;
import com.example.paymentService.constant.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class WalletUpdateRequest {
    private String userId;
    private BigDecimal amount;
    private TransactionType transactionType; // From your previous enums
    private Status status; // From your previous enums
    private String currency; // e.g., "VND" for fiat, "USDT" for crypto
}
