package com.example.notificationService.controller;

import com.example.notificationService.entity.Notification;
import com.example.notificationService.enums.Type;
import com.example.notificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/internal")
public class InternalController {
    @Autowired
    private NotificationRepository notificationRepository;

    // API để đánh dấu một thông báo là đã xu ly thanh cong
    @PutMapping("/{id}/handle-notify")
    public ResponseEntity<?> markNotificationAsHandleNotify(@PathVariable String id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();

            notification.setUpdateAt(LocalDateTime.now());

            // Kiểm tra nếu là ORDER_PAYMENT thì set handleNotify = true trong data
            if (notification.getType() == Type.ORDER_PAYMENT) {
                Map<String, Object> data = notification.getData();
                if (data == null) {
                    data = new HashMap<>();
                }
                data.put("handleNotify", true);
                notification.setData(data); // Cập nhật lại data
            }

            Notification updatedNotification = notificationRepository.save(notification);
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
