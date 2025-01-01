package com.example.watchListService.repository;

import com.example.watchListService.entity.WatchList;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WatchListRepository extends MongoRepository<WatchList, String> {
    Optional<WatchList> findByUserId(String userId);
}
