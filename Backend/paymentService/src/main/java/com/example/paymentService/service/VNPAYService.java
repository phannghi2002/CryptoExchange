package com.example.paymentService.service;

import com.example.paymentService.config.VNPAYConfig;
import com.example.paymentService.constant.Status;
import com.example.paymentService.constant.TransactionType;
import com.example.paymentService.dto.request.WalletUpdateRequest;
import com.example.paymentService.entity.PaymentTransaction;
import com.example.paymentService.repository.PaymentTransactionRepository;
import com.example.paymentService.repository.httpclient.WalletClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class VNPAYService {
    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private WalletClient walletClient;

    public String createOrder(HttpServletRequest request, int amount, String orderInfor,String userId,String nameBank, String urlReturn){
        //Các bạn có thể tham khảo tài liệu hướng dẫn và điều chỉnh các tham số
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPAYConfig.getRandomNumber(8);
        String vnp_IpAddr = VNPAYConfig.getIpAddress(request);
        String vnp_TmnCode = VNPAYConfig.vnp_TmnCode;
        String orderType = "order-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount*100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfor);
        vnp_Params.put("vnp_OrderType", orderType);

        String customOrderInfo = "userId:" + userId + "; " + orderInfor;
        vnp_Params.put("vnp_OrderInfo", customOrderInfo);


        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

       String backendReturnUrl = "http://localhost:8087/payment/vnpay-payment-return";

        //String backendReturnUrl = "http://localhost:8888/api/v1/payment/vnpay-payment-return";
        vnp_Params.put("vnp_ReturnUrl", backendReturnUrl);

        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Set bank code based on nameBank
        if ("None".equalsIgnoreCase(nameBank)) {
            // For "None", use the default payment method selection page
            vnp_Params.put("vnp_BankCode", ""); // No specific bank code, let VNPay choose
        } else if ("NCB".equalsIgnoreCase(nameBank)) {
            vnp_Params.put("vnp_BankCode", "Ncb"); // Specify NCB bank
        } else if ("MB".equalsIgnoreCase(nameBank)) {
            vnp_Params.put("vnp_BankCode", "MBBank"); // Specify MB Bank
        } else if ("VCB".equalsIgnoreCase(nameBank)) {
            vnp_Params.put("vnp_BankCode", "VietinBank"); // Specify TP Bank (Vietcombank)
        } else if ("SCB".equalsIgnoreCase(nameBank)) {
            vnp_Params.put("vnp_BankCode", "Scb"); // Specify ACB Bank
        }

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String salt = VNPAYConfig.vnp_HashSecret;
        String vnp_SecureHash = VNPAYConfig.hmacSHA512(salt, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPAYConfig.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }


    public int orderReturn(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(fieldName, fieldValue); // Không giải mã
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        log.info("Received vnp_SecureHash: {}", vnp_SecureHash);
        log.info("Fields before hashing: {}", fields);

        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPAYConfig.hashAllFields(fields);
        log.info("Generated signValue: {}", signValue);

        if (signValue.equals(vnp_SecureHash)) {
            log.info("Signature matched, proceeding with transaction processing");

            String transactionNo = fields.get("vnp_TransactionNo");
            // Giải mã vnp_OrderInfo để lấy userId sau khi xác minh chữ ký
            String orderInfo = fields.get("vnp_OrderInfo");
            String userId = null;
            if (orderInfo != null && orderInfo.contains("userId:")) { // Kiểm tra userId: thay vì userId%3A
                String[] parts = orderInfo.split(";"); // Không cần giải mã vì giá trị đã không mã hóa
                for (String part : parts) {
                    if (part.trim().startsWith("userId:")) {
                        userId = part.split(":", 2)[1].trim(); // Sử dụng split với giới hạn 2 để tránh lỗi
                        break;
                    }
                }
            }
            log.info("Decoded userId: {}", userId);

            BigDecimal amount = new BigDecimal(fields.get("vnp_Amount")).divide(new BigDecimal("100"));
            String paymentTime = fields.get("vnp_PayDate");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            LocalDateTime paymentTimeFormat = LocalDateTime.parse(paymentTime, formatter);

            String bankCode = fields.get("vnp_BankCode");
            String transactionStatus = fields.get("vnp_TransactionStatus");
            String responseCode = fields.get("vnp_ResponseCode");
            String txnRef = fields.get("vnp_TxnRef");

            log.info("in ra userid {}", userId);

            // Determine status based on responseCode
            Status status;
            switch (responseCode) {
                case "00":
                    status = Status.SUCCESS;
                    break;
                case "07":
                    status = Status.PENDING;
                    break;
                default:
                    status = Status.FAILED;
            }

            // Determine transaction type based on orderInfo
            TransactionType transactionType;
            if (orderInfo != null && orderInfo.toLowerCase().contains("deposit")) {
                transactionType = TransactionType.DEPOSIT;
            } else if (orderInfo != null && orderInfo.toLowerCase().contains("withdraw")) {
                transactionType = TransactionType.WITHDRAW;
            } else {
                transactionType = TransactionType.PAYMENT;
            }

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .userId(userId)
                    .amount(amount)
                    .status(status)
                    .transactionType(transactionType)
                    .createdAt(LocalDateTime.now())
                    .paymentTime(paymentTimeFormat)
                    .transactionNo(transactionNo)
                    .bankCode(bankCode)
                    .txnRef(txnRef)
                    .responseCode(responseCode)
                    .transactionStatus(transactionStatus)
                    .build();

            paymentTransactionRepository.save(transaction);

            if (status == Status.SUCCESS) {
                WalletUpdateRequest walletRequest = WalletUpdateRequest.builder()
                        .userId(userId)
                        .amount(amount)
                        .transactionType(transactionType)
                        .status(status)
                        .currency("VND")
                        .build();

                try {
                    walletClient.updateWalletBalance(walletRequest);
                    log.info("Wallet balance updated successfully for userId: {}", userId);
                } catch (Exception e) {
                    log.error("Failed to update wallet balance for userId: {}. Error: {}", userId, e.getMessage(), e);
                }
            }

            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                return 1;
            } else {
                return 0;
            }
        } else {
            log.error("Signature mismatch! signValue: {}, vnp_SecureHash: {}", signValue, vnp_SecureHash);
            return -1;
        }
    }

    public List<PaymentTransaction> getTransaction (String userId){
        return paymentTransactionRepository.findByUserIdOrderByPaymentTimeDesc(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho userID: " + userId));
    }


}