package com.example.paymentService.entity;

import com.example.paymentService.constant.Status;
import com.example.paymentService.constant.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column
    String userId;

    @Column(nullable = false, precision = 18, scale = 8)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    TransactionType transactionType;

    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt;

    // VNPay-specific fields
    @Column(name = "payment_time")
    LocalDateTime paymentTime;

    @Column(name = "transaction_no")
    String transactionNo; // vnp_TransactionNo

    @Column(name = "bank_code")
    String bankCode;

    @Column(name = "txn_ref")
    String txnRef; // vnp_TxnRef

    @Column(name = "response_code")
    String responseCode; // vnp_ResponseCode

    @Column(name = "transaction_status")
    String transactionStatus; // vnp_TransactionStatus

}
