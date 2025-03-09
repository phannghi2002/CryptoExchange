package com.example.paymentService.controller;


import com.example.paymentService.entity.PaymentTransaction;
import com.example.paymentService.repository.PaymentTransactionRepository;
import com.example.paymentService.service.VNPAYService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;


import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController()
public class PaymentController {
    @Autowired
    private VNPAYService vnPayService;
    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    // Chuyển hướng người dùng đến cổng thanh toán VNPAY
    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
                              @RequestParam("orderInfo") String orderInfo,
                              @RequestParam("nameBank") String nameBank,
                              HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(request, orderTotal, orderInfo, nameBank, baseUrl);
        log.info("in ra xem nao");
        return vnpayUrl; // Return the VNPay URL directly (frontend will handle navigation)
    }


    // Sau khi hoàn tất thanh toán, VNPAY sẽ chuyển hướng trình duyệt về URL này
    @GetMapping("/vnpay-payment-return")
    public RedirectView paymentCompleted(HttpServletRequest request) {
        // Convert HttpServletRequest parameters to Map<String, String>
        Map<String, String> params = new HashMap<>();
        for (Enumeration<String> names = request.getParameterNames(); names.hasMoreElements();) {
            String name = names.nextElement();
            String value = request.getParameter(name);
            params.put(name, value);
        }

        // Call orderReturn with the HttpServletRequest
        int paymentStatus = vnPayService.orderReturn(request);

        // Extract parameters for forwarding to frontend
        String orderInfo = params.get("vnp_OrderInfo");
        String paymentTime = params.get("vnp_PayDate");
        String transactionId = params.get("vnp_TransactionNo");
        String totalPrice = params.get("vnp_Amount");
        String responseCode = params.get("vnp_ResponseCode");
        String result = paymentStatus == 1 ? "orderSuccess" : "orderFailed";

        //Save database

        // Decode orderInfo if needed
        if (orderInfo != null) {
            orderInfo = URLDecoder.decode(orderInfo, StandardCharsets.UTF_8);
        }

        // Construct query parameters for frontend navigation
        StringBuilder queryParams = new StringBuilder();
        queryParams.append("?result=").append(URLEncoder.encode(result, StandardCharsets.UTF_8));
        if (orderInfo != null) {
            queryParams.append("&orderId=").append(URLEncoder.encode(orderInfo, StandardCharsets.UTF_8));
        }
        if (totalPrice != null) {
            queryParams.append("&totalPrice=").append(URLEncoder.encode(totalPrice, StandardCharsets.UTF_8));
        }
        if (paymentTime != null) {
            queryParams.append("&paymentTime=").append(URLEncoder.encode(paymentTime, StandardCharsets.UTF_8));
        }
        if (transactionId != null) {
            queryParams.append("&transactionId=").append(URLEncoder.encode(transactionId, StandardCharsets.UTF_8));
        }
        if (responseCode != null) {
            queryParams.append("&responseCode=").append(URLEncoder.encode(responseCode, StandardCharsets.UTF_8));
        }

        log.info("Redirecting to frontend silently: http://localhost:5173/payment-result{}", queryParams.toString());

        // Redirect to frontend payment-result silently (no JSON, user sees frontend URL only)
        //return "redirect:http://localhost:5173/payment-result" + queryParams.toString();
        //vì là đang dùng RestController trả về JSON nên dùng phương pháp ở trên sẽ không được
        //trừ khi dùng Controller. Còn dùng RedirectView thì Controller hay RestController đều được
        return new RedirectView("http://localhost:5173/payment-result" + queryParams.toString());
    }

    @GetMapping("/transaction")
    public List<PaymentTransaction> getTransaction(@RequestParam String userId) {
        return vnPayService.getTransaction(userId);

    }
}
