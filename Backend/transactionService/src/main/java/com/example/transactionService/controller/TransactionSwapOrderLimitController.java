package com.example.transactionService.controller;

import com.example.transactionService.dto.request.TransactionSwapOrderLimitRequest;
import com.example.transactionService.dto.request.UpdateTransactionSwapOrderLimitRequest;
import com.example.transactionService.entity.TransactionSwapOrderLimit;
import com.example.transactionService.service.TransactionSwapOrderLimitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/swap-order-limit")
public class TransactionSwapOrderLimitController {
    @Autowired
    private TransactionSwapOrderLimitService transactionSwapOrderLimitService;

    @PostMapping("/save")
    public ResponseEntity<TransactionSwapOrderLimit> createSwapOrderLimit(@RequestBody TransactionSwapOrderLimitRequest request) {
        TransactionSwapOrderLimit transaction = transactionSwapOrderLimitService.createTransactionSwapOrderLimit(request);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TransactionSwapOrderLimit> updateSwapOrderLimit(@PathVariable String id, @RequestBody UpdateTransactionSwapOrderLimitRequest request) {
        TransactionSwapOrderLimit transaction = transactionSwapOrderLimitService.updateTransactionSwapOrderLimit(id, request);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getTransactionByUserId(@PathVariable String userId) {
        try {
            List<TransactionSwapOrderLimit> transaction = transactionSwapOrderLimitService.getTransactionSwapOrderLimit(userId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/get-all-status-pending/{userId}")
    public ResponseEntity<?> getTransactionStatusPendingByUserId(@PathVariable String userId) {
        try {
            Optional<List<TransactionSwapOrderLimit>> transaction = transactionSwapOrderLimitService.getTransactionStatusPendingByUserId(userId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/get-all-status-another-pending/{userId}")
    public ResponseEntity<?> getTransactionStatusAnotherPendingByUserId(@PathVariable String userId) {
        try {
            Optional<List<TransactionSwapOrderLimit>> transaction = transactionSwapOrderLimitService.getTransactionStatusAnotherPendingByUserId(userId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
