package com.example.sharedLibrary;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationEvent {
    String channel; //Email, SMS, Zalo,...
    String recipient;
    EmailTemplate template; // Sử dụng enum thay vì String
    Map<String, Object> param; // Tham số động để tạo nội dung email

}
