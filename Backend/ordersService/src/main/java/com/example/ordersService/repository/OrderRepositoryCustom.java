package com.example.ordersService.repository;

import com.example.ordersService.dto.response.SubOrderWithCoinDTO;

import java.util.List;

public interface OrderRepositoryCustom {
    List<SubOrderWithCoinDTO> findSubOrdersWithBuyerIdAndStatuses(String userId, List<String> statuses);
}


