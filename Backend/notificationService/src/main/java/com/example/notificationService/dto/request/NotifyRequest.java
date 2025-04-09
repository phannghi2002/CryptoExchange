package com.example.notificationService.dto.request;

import com.example.notificationService.enums.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotifyRequest {
    String userId;
    Type type;
    String message;
    Map<String, Object> data;
}
