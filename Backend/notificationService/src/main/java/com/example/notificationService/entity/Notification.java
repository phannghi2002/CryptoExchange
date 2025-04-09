package com.example.notificationService.entity;

import com.example.notificationService.enums.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;


@Document(collection = "notification")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;

    @Field("user_id")
    private String userId;

    private Type type; // Loại thông báo (ví dụ: "ORDER_PAYMENT", "ORDER_CONFIRM", "KYC_UPDATE")

    private String message; // Nội dung thông báo chung

    private Map<String, Object> data; // Dữ liệu bổ sung (ví dụ: orderId, subOrderId, kycStatus)

    @Field("is_read")
    private boolean isRead;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updateAt;

}



