package com.example.ordersService.repository;


import com.example.ordersService.dto.response.SubOrderWithCoinDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderRepositoryCustomImpl implements OrderRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<SubOrderWithCoinDTO> findSubOrdersWithBuyerIdAndStatuses(String userId, List<String> statuses) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").ne(userId)), // userId != userId truyền vào
                Aggregation.unwind("subOrders"),
                Aggregation.match(
                        new Criteria().andOperator(
                                Criteria.where("subOrders.buyerId").is(userId),
                                Criteria.where("subOrders.status").in(statuses)
                        )
                ),
//                Aggregation.replaceRoot("subOrders") // Trả về toàn bộ subOrder (không gói trong Order nữa)
                Aggregation.project()
                        .and("subOrders.subOrderId").as("subOrderId")
                        .and("subOrders.buyerId").as("buyerId")
                        .and("subOrders.amount").as("amount")
                        .and("subOrders.priceVnd").as("priceVnd")
                        .and("subOrders.status").as("status")
                        .and("subOrders.paymentMethods").as("paymentMethods")
                        .and("subOrders.createAt").as("createAt")
                        .and("subOrders.paymentDeadline").as("paymentDeadline")
                        .and("subOrders.cancelDeadline").as("cancelDeadline")
                        .and("coin").as("coin")
                        .andExclude("_id")
        );

        AggregationResults<SubOrderWithCoinDTO> results = mongoTemplate.aggregate(aggregation, "orders", SubOrderWithCoinDTO.class);
        return results.getMappedResults();
    }
}

