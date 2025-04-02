package com.example.walletService.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class ChangeCoinRequest {
    private String currency;
    private BigDecimal amount;
}
