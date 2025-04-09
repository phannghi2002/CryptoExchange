package com.example.notificationService.controller;

import com.example.notificationService.dto.request.NotifyRequest;
import com.example.notificationService.dto.response.NotifyResponse;
import com.example.notificationService.entity.Notification;
import com.example.notificationService.enums.Type;
import com.example.notificationService.repository.NotificationRepository;
import com.example.notificationService.service.NotifyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class NotifyController {
    NotificationRepository notificationRepository;
    private final NotifyService notifyService;

    @PostMapping("/create")
    public ResponseEntity<Notification> createNotification(@RequestBody NotifyRequest notifyRequest) {
        Notification notification = Notification.builder()
                .userId(notifyRequest.getUserId())
                .type(notifyRequest.getType())
                .message(notifyRequest.getMessage())
                .data(notifyRequest.getData())
                .isRead(false) // Mặc định là chưa đọc
                .createdAt(LocalDateTime.now())
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.ok(savedNotification);
    }

    // API để lấy tất cả thông báo cho một người dùng cụ thể
    @GetMapping("/user/{userId}")
    public ResponseEntity<NotifyResponse> getNotificationsByUserId(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(userId);

        NotifyResponse response = new NotifyResponse(notifications, unreadCount);
        return ResponseEntity.ok(response);
    }


    // API để lấy một thông báo theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable String id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API để đánh dấu một thông báo là đã đọc
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable String id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true);
            notification.setUpdateAt(LocalDateTime.now());

            // Kiểm tra nếu là ORDER_PAYMENT thì set handleNotify = true trong data
//            if (notification.getType() == Type.ORDER_PAYMENT) {
//                Map<String, Object> data = notification.getData();
//                if (data == null) {
//                    data = new HashMap<>();
//                }
//                data.put("handleNotify", true);
//                notification.setData(data); // Cập nhật lại data
//            }

            Notification updatedNotification = notificationRepository.save(notification);
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // API để đánh dấu một thông báo là đã xu ly thanh cong
    @PutMapping("/{id}/handle-notify")
    public ResponseEntity<Notification> markNotificationAsHandleNotify(@PathVariable String id) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable String id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (notification.isRead()) {
                notificationRepository.deleteById(id);
                return ResponseEntity.ok("Thông báo đã được xóa.");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Chỉ được phép xóa thông báo đã đọc.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy thông báo.");
        }
    }

    @DeleteMapping("/user/{userId}/read")
    public ResponseEntity<String> deleteAllReadNotifications(@PathVariable String userId) {
        notificationRepository.deleteByUserIdAndIsReadTrue(userId);
        return ResponseEntity.ok("Đã xóa tất cả thông báo đã đọc.");
    }

    @DeleteMapping("/user/{userId}/read-handled")
    public ResponseEntity<String> deleteAllReadAndHandledNotifications(@PathVariable String userId) {

        return ResponseEntity.ok(notifyService.deleteNotifyReadAndHandled(userId));
    }
}
