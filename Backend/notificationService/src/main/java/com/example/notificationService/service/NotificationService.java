package com.example.notificationService.service;

import com.example.notificationService.entity.Notification;
import com.example.notificationService.enums.Type;
import com.example.notificationService.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    @KafkaListener(topics = "order-events")
    public void listenOrderEvents(@Payload Map<String, Object> event) {
        if ("PAYMENT_SUBMITTED".equals(event.get("status"))) {
            String subOrderId = (String) event.get("subOrderId");
            String sellerId = (String) event.get("sellerId");
            String buyerId = (String) event.get("buyerId");
            String orderId = (String) event.get("orderId");
            String notify = "Người mua đã chuyển khoản cho đơn hàng #" + orderId + " và subOrderId " + subOrderId + ". Vui lòng xác nhận.";
            log.info("in ra xem kafka chay chua {}", subOrderId + " buyerId" + buyerId + " sellerId " + sellerId);
            log.info("Sending notification to /topic/notifications/{}: {}", sellerId, notify);

            // Tạo Map data để chứa orderId và subOrderId
            Map<String, Object> data = new HashMap<>();
            data.put("orderId", orderId);
            data.put("subOrderId", subOrderId);
            data.put("handleNotify", false);

            Notification notification = Notification.builder()
                    .userId(sellerId)
                    .type(Type.ORDER_PAYMENT)
                    .message(notify)
                    .data(data)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            messagingTemplate.convertAndSend("/topic/notifications/" + sellerId, notification);

        }
    }

    @KafkaListener(topics = "order-wallet-events")
    public void listenOrderWalletEvents(@Payload Map<String, Object> event) {
        if ("PAYMENT_CONFIRMED".equals(event.get("status"))) {
            String orderId = (String) event.get("orderId");
            String subOrderId = (String) event.get("subOrderId");
            String sellerId = (String) event.get("sellerId");
            String buyerId = (String) event.get("buyerId");

            String notify = "Đơn hàng có mã " + subOrderId + " đã được người bán " + sellerId + " xác nhận thành công" +
                    ". Giao dịch hoàn tất. Kiểm tra ví tiền của bạn.";
            log.info("in ra xem kafka chay chua {}", subOrderId + " buyerId" + buyerId + " sellerId " + sellerId);
            log.info("Sending notification to /topic/notifications/{}: {}", buyerId, notify);

            // Tạo Map data để chứa orderId và subOrderId
            Map<String, Object> data = new HashMap<>();
            data.put("orderId", orderId);
            data.put("subOrderId", subOrderId);
            data.put("sellerId", sellerId);

            Notification notification = Notification.builder()
                    .userId(buyerId)
                    .type(Type.ORDER_CONFIRM)
                    .message(notify)
                    .data(data)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

            messagingTemplate.convertAndSend("/topic/notifications/" + buyerId, notification);

        }
    }

}
