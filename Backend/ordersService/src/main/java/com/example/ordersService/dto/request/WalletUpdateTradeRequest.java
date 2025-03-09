package com.example.ordersService.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WalletUpdateTradeRequest {
    private String buyerId;
    private String sellerId;
    private BigDecimal amountFiat;
    private BigDecimal amountCrypto;
    private String cryptoType;
}
