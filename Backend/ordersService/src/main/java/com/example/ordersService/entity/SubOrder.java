package com.example.ordersService.entity;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubOrder {
    String subOrderId;
    String buyerId;
    double amount;
    double priceVnd;
    Status status;
    PaymentMethod paymentMethods;
    Date createAt;
    Date paymentDeadline;
    Date cancelDeadline;
}
