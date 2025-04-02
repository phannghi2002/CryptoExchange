package com.example.transactionService.service;

import com.example.transactionService.dto.request.TransactionSwapOrderLimitRequest;
import com.example.transactionService.dto.request.UpdateTransactionSwapOrderLimitRequest;
import com.example.transactionService.entity.TransactionSwapOrderLimit;
import com.example.transactionService.repository.TransactionSwapOrderLimitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionSwapOrderLimitService {
    @Autowired
    private TransactionSwapOrderLimitRepository transactionSwapOrderLimitRepository;

    public TransactionSwapOrderLimit createTransactionSwapOrderLimit(TransactionSwapOrderLimitRequest request) {
        TransactionSwapOrderLimit transactionSwapOrderLimit = TransactionSwapOrderLimit.builder()
                .userId(request.getUserId())
                .originCoin(request.getOriginCoin())
                .originAmount(request.getOriginAmount())
                .targetCoin(request.getTargetCoin())
                .targetAmount(request.getTargetAmount())
                .status(request.getStatus())
                .type(request.getType())
                .total(request.getTotal())
                .pair(request.getPair())
                .build();

        return transactionSwapOrderLimitRepository.save(transactionSwapOrderLimit);
    }

    public TransactionSwapOrderLimit updateTransactionSwapOrderLimit(String id, UpdateTransactionSwapOrderLimitRequest request){
        TransactionSwapOrderLimit transactionSwapOrderLimit =  transactionSwapOrderLimitRepository.findById(id).orElse(null);
        transactionSwapOrderLimit.setStatus(request.getStatus());

        transactionSwapOrderLimitRepository.save(transactionSwapOrderLimit);
        return transactionSwapOrderLimit;
    }
    public List<TransactionSwapOrderLimit> getTransactionSwapOrderLimit(String userId) {
        return transactionSwapOrderLimitRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch swap cho userId: " + userId));
    }
    public Optional<List<TransactionSwapOrderLimit>> getTransactionStatusPendingByUserId(String userId) {
        return Optional.of(transactionSwapOrderLimitRepository.findByUserIdAndStatusPending(userId).orElse(List.of()));

    }
    public Optional<List<TransactionSwapOrderLimit>> getTransactionStatusAnotherPendingByUserId(String userId) {
        return Optional.of(transactionSwapOrderLimitRepository.findByUserIdAndStatusAnotherPending(userId).orElse(List.of()));

    }
}
