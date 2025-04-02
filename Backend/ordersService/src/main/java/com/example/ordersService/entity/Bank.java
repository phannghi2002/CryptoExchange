package com.example.ordersService.entity;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Document(collection = "banks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bank {
    @Id
    String id;
    String userId;
    String nameBank;
    String numberAccount;
    String nameAccount;
    String contentPay;
}
