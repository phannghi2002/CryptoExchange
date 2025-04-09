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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotifyService {
    @Autowired
    private NotificationRepository notificationRepository;

    public String deleteNotifyReadAndHandled(String userId) {
        List<Notification> listNotify = notificationRepository.findByUserIdAndIsReadTrue(userId);

        List<Notification> toDelete = listNotify.stream()
                .filter(notify -> {

                    if (Type.ORDER_CONFIRM.equals(notify.getType())) {
                        return true; // ORDER_CONFIRM thì xóa luôn
                    }


                    // Nếu là ORDER_PAYMENT, kiểm tra handleNotify
                    Map<String, Object> data = notify.getData();
                    Object handleNotify = data != null ? data.get("handleNotify") : null;

                    // Ép kiểu nếu cần
                    if (handleNotify instanceof Boolean) {
                        return (Boolean) handleNotify;
                    }

                    // Nếu là String "true"
                    if (handleNotify instanceof String) {
                        return "true".equalsIgnoreCase((String) handleNotify);
                    }

                    return false;
                })
                .collect(Collectors.toList());

        notificationRepository.deleteAll(toDelete);
        return "Đã xóa " + toDelete.size() + " thông báo đã đọc và đã xử lý";
    }
}
