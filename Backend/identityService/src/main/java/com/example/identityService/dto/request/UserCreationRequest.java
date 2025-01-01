package com.example.identityService.dto.request;

import java.time.LocalDate;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    String email;
    String password;

    String firstName;
    String lastName;

    LocalDate dob;
    String city;
}
