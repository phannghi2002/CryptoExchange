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

@Document(collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    String id;
    String orderId;
    String userId;
    String coin;
    double amount;
    double remainingAmount;  // Cập nhật số lượng còn lại
    double price;
    Status status;
    List<PaymentMethod> paymentMethods;
    List<SubOrder> subOrders; // Danh sách subOrder
    Date createdAt;
    Date updatedAt;
    int paymentDeadline; // Thời gian tối đa để thanh toán (15-20 phút do người bán quy định)
//    Date cancelDeadline;// Thời gian chờ khiếu nại (24 giờ sau khi FAILED)

    BigDecimal minimum;
    BigDecimal maximum;

    String policy;
}
