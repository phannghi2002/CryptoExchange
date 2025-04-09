package com.example.notificationService.repository;

import com.example.notificationService.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserId(String userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndIsReadTrue(String userId);

    long countByUserIdAndIsReadFalse(String userId);

    // Xóa 1 thông báo theo id nếu đã đọc
    void deleteByIdAndIsReadTrue(String id);

    // Xóa tất cả thông báo đã đọc theo userId
    void deleteByUserIdAndIsReadTrue(String userId);

}
