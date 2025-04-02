package com.example.transactionService.repository;


import com.example.transactionService.entity.TransactionSwapOrderLimit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransactionSwapOrderLimitRepository extends MongoRepository<TransactionSwapOrderLimit, String> {
    @Query(sort = "{ 'timestamp' : -1 }")
    Optional<List<TransactionSwapOrderLimit>> findByUserId(String userId);

    @Query("{ 'user_id' : ?0, 'status' : 'PENDING' }")
    Optional<List<TransactionSwapOrderLimit>> findByUserIdAndStatusPending(String userId);

    @Query("{ 'user_id' : ?0, 'status' : { '$ne' : 'PENDING' } }")
    Optional<List<TransactionSwapOrderLimit>> findByUserIdAndStatusAnotherPending(String userId);

}
