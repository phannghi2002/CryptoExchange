package com.example.transactionService.controller;

import com.example.transactionService.dto.request.TransactionSwapRequest;
import com.example.transactionService.entity.TransactionSwap;
import com.example.transactionService.service.TransactionSwapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/swap")
public class TransactionSwapController {
    @Autowired
    private TransactionSwapService transactionSwapService;

    @PostMapping("/save")
    public ResponseEntity<TransactionSwap> createSwap(@RequestBody TransactionSwapRequest request) {
        TransactionSwap transaction = transactionSwapService.createTransactionSwap(request);
        return ResponseEntity.ok(transaction);
    }
    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getTransactionByUserId(@PathVariable String userId) {
        try {
            List<TransactionSwap> transaction = transactionSwapService.getTransactionSwap(userId);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
