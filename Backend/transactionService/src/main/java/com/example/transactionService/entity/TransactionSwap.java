package com.example.transactionService.entity;

import com.example.transactionService.constant.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions_swap")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionSwap {
    @Id
    String id;

    @Field("user_id")
    String userId;

    @Field("type")
    @Builder.Default
    Type type = Type.SWAP; // Luôn là SWAP

    @Field("origin_coin")
     String originCoin;

    @Field("origin_amount")
     BigDecimal originAmount;

    @Field("origin_price")
    BigDecimal originPrice;

    @Field("target_coin")
     String targetCoin;

    @Field("target_amount")
     BigDecimal targetAmount;

    @Field("target_price")
    BigDecimal targetPrice;

    @Field("timestamp")
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();

}
