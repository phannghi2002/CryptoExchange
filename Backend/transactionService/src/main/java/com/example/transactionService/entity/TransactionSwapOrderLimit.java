package com.example.transactionService.entity;

import com.example.transactionService.constant.Status;
import com.example.transactionService.constant.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions_swap_order_limit")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionSwapOrderLimit {
    @Id
    String id;

    @Field("user_id")
    String userId;

    @Field("origin_coin")
     String originCoin;

    @Field("origin_amount")
     BigDecimal originAmount;

    @Field("target_coin")
     String targetCoin;

    @Field("target_amount")
     BigDecimal targetAmount;

    @Field("status")
    Status status;

    @Field("type")
    Type type;

    @Field("total")
    BigDecimal total;

    @Field("pair")
    String pair;

    @Field("timestamp")
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();

}
