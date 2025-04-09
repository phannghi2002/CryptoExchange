package com.example.ordersService.repository;

import com.example.ordersService.constant.Status;
import com.example.ordersService.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String>, OrderRepositoryCustom {
    List<Order> findByCoin(String coin);

    List<Order> findByPaymentMethodsContainingIgnoreCase(String paymentMethod);

    List<Order> findByCoinAndPaymentMethodsContainingIgnoreCase(String coin, String paymentMethod);

    Page<Order> findAll(Pageable pageable); // Phương thức phân trang

    List<Order> findByUserIdNot(String userId);

    List<Order> findByUserIdNotAndStatus(String userId, Status status);

    Page<Order> findByUserIdNotAndStatus(String userId, Status status, Pageable pageable);

    Page<Order> findByUserIdAndStatus(String userId, Status status, Pageable pageable);

    List<Order> findByUserId(String userId);

    List<Order> findByUserIdNotAndCoin(String userId, String coin);

    List<Order> findByUserIdNotAndPaymentMethodsContainingIgnoreCase(String userId, String paymentMethod);

    List<Order> findByUserIdNotAndCoinAndPaymentMethodsContainingIgnoreCase(String userId, String coin, String paymentMethod);

    Page<Order> findAllByUserId(Pageable pageable,String userId);

    List<Order> findByUserIdAndStatus(String userId, Status status);

    Order findByOrderId(String orderId);
}
