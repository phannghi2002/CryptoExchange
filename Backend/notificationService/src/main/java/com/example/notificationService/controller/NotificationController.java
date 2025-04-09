package com.example.notificationService.controller;

import com.example.notificationService.dto.request.Recipient;
import com.example.notificationService.dto.request.SendEmailRequest;
import com.example.notificationService.service.EmailService;

import com.example.sharedLibrary.NotificationEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    EmailService emailService;

    @KafkaListener(topics = "notification-delivery")
    public void listenNotificationDelivery(NotificationEvent message){
        String subject = message.getTemplate().generateSubject(message.getParam());
        String body = message.getTemplate().generateBody(message.getParam());

        log.info("Message received: {}",message);
        emailService.sendEmail(SendEmailRequest.builder()
                        .to(Recipient.builder()
                                .email(message.getRecipient())
                                .build())
                        .subject(subject)
                        .htmlContent(body)
                .build());
    }

//    @KafkaListener(topics = "order-events", groupId = "notification-group")
//    public void listenOrderEvents(String message) {
//        JsonObject event = new JsonParser().parse(message).getAsJsonObject();
//        if ("PAYMENT_SUBMITTED".equals(event.get("status").getAsString())) {
//            String sellerId = event.get("sellerId").getAsString();
//            String orderId = event.get("orderId").getAsString();
//            String notification = "Người mua đã chuyển khoản cho đơn hàng #" + orderId + ". Vui lòng xác nhận.";
//            messagingTemplate.convertAndSend("/topic/notifications/" + sellerId, notification);
//        }
//    }

//    @KafkaListener(topics = "order-events")
//    public void listenOrderEvents(String message) {
//        JSONObject event = new JSONObject(message);
//        if ("PAYMENT_SUBMITTED".equals(event.getString("status"))) {
//            String sellerId = event.getString("sellerId");
//            String orderId = event.getString("orderId");
//            String notification = "Người mua đã chuyển khoản cho đơn hàng #" + orderId + ". Vui lòng xác nhận đã nhận tiền.";
//            messagingTemplate.convertAndSend("/topic/notifications/" + sellerId, notification);
//        }
//    }

}
