package com.example.walletService.dto.request;

import com.example.walletService.constant.Status;
import com.example.walletService.constant.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class WalletUpdateRequest {
    private String userId;
    private TransactionType transactionType; // From your previous enums
    private Status status; // From your previous enums

    // Cho DEPOSIT/WITHDRAW
    private String currency; // Nếu là DEPOSIT hoặc WITHDRAW
    private BigDecimal amount;

    // Cho SWAP
    private String originCurrency; // Đồng coin nguồn
    private BigDecimal originAmount;
    private String targetCurrency; // Đồng coin đích
    private BigDecimal targetAmount;
}
