package com.example.walletService.controller;

import com.example.walletService.dto.request.ChangeCoinRequest;
import com.example.walletService.dto.request.WalletUpdateTradeRequest;
import com.example.walletService.entity.Wallets;
import com.example.walletService.service.WalletService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalController {
    WalletService walletService;

    @PutMapping("/internal/substract-coin/{userId}")
     ResponseEntity<?> substractCoinWallet(@PathVariable String userId, @RequestBody ChangeCoinRequest request) {
        try {
            Wallets substractCoinWallet = walletService.substractCoinWallet(userId, request);
            return ResponseEntity.ok(substractCoinWallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/internal/add-coin/{userId}")
    public ResponseEntity<?> returnCoinWallet(@PathVariable String userId, @RequestBody ChangeCoinRequest request) {
        try {
            Wallets returnCoinWallet = walletService.returnCoinWallet(userId, request);
            return ResponseEntity.ok(returnCoinWallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/internal/updateTrade")
    public ResponseEntity<?> updateWalletTrade(@RequestBody WalletUpdateTradeRequest request) {
        try {
            List<Wallets> updatedWalletTrade = walletService.updateWalletTrade(request);
            return ResponseEntity.ok(updatedWalletTrade);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
