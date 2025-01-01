package com.example.watchListService.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "watchlist")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WatchList {
    @Id
    private String id;  // ID của watchlist
    private String userId;  // ID của người dùng
    private List<String> coinIds;
}
