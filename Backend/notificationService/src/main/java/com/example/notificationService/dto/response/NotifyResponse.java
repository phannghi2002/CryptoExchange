package com.example.notificationService.dto.response;

import com.example.notificationService.entity.Notification;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotifyResponse {
    List<Notification> notifications;
    long unreadCount;
}
