package com.example.transactionService.service;

import com.example.transactionService.dto.request.TransactionSwapRequest;
import com.example.transactionService.entity.TransactionSwap;
import com.example.transactionService.repository.TransactionSwapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionSwapService {
    @Autowired
    private TransactionSwapRepository transactionSwapRepository;

    public TransactionSwap createTransactionSwap(TransactionSwapRequest request) {
        TransactionSwap transactionSwap = TransactionSwap.builder()
                .userId(request.getUserId())
                .originCoin(request.getOriginCoin())
                .originAmount(request.getOriginAmount())
                .originPrice(request.getOriginPrice())
                .targetCoin(request.getTargetCoin())
                .targetAmount(request.getTargetAmount())
                .targetPrice(request.getTargetPrice())
                .build();

        return transactionSwapRepository.save(transactionSwap);
    }

    public List<TransactionSwap> getTransactionSwap(String userId) {
        return transactionSwapRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch swap cho userId: " + userId));
    }
}
