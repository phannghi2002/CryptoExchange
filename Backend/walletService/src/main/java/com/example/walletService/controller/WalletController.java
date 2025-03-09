package com.example.walletService.controller;

import com.example.walletService.dto.request.WalletUpdateRequest;
import com.example.walletService.dto.request.WalletUpdateTradeRequest;
import com.example.walletService.entity.Wallets;
import com.example.walletService.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WalletController {
    @Autowired
    private WalletService walletService;

    @GetMapping("/getWallet")
    public ResponseEntity<?> getWalletOfUSer(@RequestParam String userID) {
        try {
            Wallets wallet = walletService.getWalletOfUser(userID);
            if (wallet == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("UserID không tồn tại hoặc không có ví.");
            }
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateWallet(@RequestBody WalletUpdateRequest request) {
        try {
            Wallets updatedWallet = walletService.updateWallet(request);
            return ResponseEntity.ok(updatedWallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/updateTrade")
    public ResponseEntity<?> updateWalletTrade(@RequestBody WalletUpdateTradeRequest request) {
        try {
            List<Wallets> updatedWalletTrade = walletService.updateWalletTrade(request);
            return ResponseEntity.ok(updatedWalletTrade);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

