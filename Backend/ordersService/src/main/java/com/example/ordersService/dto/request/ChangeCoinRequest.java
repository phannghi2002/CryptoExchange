package com.example.ordersService.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ChangeCoinRequest {
    private String currency;
    private BigDecimal amount;
}
