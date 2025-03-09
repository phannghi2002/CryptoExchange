package com.example.paymentService.repository;

import com.example.paymentService.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {
//    Optional<List<PaymentTransaction>> findByUserId(String userId);

    @Query("SELECT p FROM PaymentTransaction p WHERE p.userId = :userId ORDER BY p.paymentTime DESC")
    Optional<List<PaymentTransaction>> findByUserIdOrderByPaymentTimeDesc(@Param("userId") String userId);

//can use method below but performance decrease
//Optional<List<PaymentTransaction>> findByUserIdOrderByPaymentTimeDesc(String userId);


}
