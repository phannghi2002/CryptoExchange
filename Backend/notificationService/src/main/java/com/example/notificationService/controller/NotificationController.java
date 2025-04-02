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
}
