package com.example.identityService.entity;

import java.util.Set;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true)
    String email;
    String password;

    @ManyToMany(fetch = FetchType.EAGER)
    Set<Role> roles;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    Boolean twoAuth = false;

}
