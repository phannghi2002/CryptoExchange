package com.example.transactionService.repository;


import com.example.transactionService.entity.TransactionSwap;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransactionSwapRepository extends MongoRepository<TransactionSwap, String> {
    @Query(sort = "{ 'timestamp' : -1 }")
    Optional<List<TransactionSwap>> findByUserId(String userId);
}
