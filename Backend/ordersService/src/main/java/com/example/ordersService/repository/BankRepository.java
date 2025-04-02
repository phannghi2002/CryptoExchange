package com.example.ordersService.repository;

import com.example.ordersService.entity.Bank;
import com.example.ordersService.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BankRepository extends MongoRepository<Bank, String> {


    Optional<Bank> findByUserId(String coin);




}
