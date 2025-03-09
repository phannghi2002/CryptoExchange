package com.example.walletService.repository;


import com.example.walletService.entity.Wallets;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WalletsRepository extends MongoRepository<Wallets, String> {
    Optional<Wallets> findByUserId(String userId);
}
