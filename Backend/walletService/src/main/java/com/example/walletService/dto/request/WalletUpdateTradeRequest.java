package com.example.walletService.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class WalletUpdateTradeRequest {
    private String buyerId;
    private String sellerId;
    private BigDecimal amountFiat;
    private BigDecimal amountCrypto;
    private String cryptoType;
}
