package com.example.ordersService.dto.response;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubOrderWithCoinDTO {
    String subOrderId;
    String buyerId;
    double amount;
    double priceVnd;
    Status status;
    PaymentMethod paymentMethods;
    Date createAt;
    Date paymentDeadline;
    Date cancelDeadline;

    String coin;
}
