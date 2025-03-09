package com.example.ordersService.service;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import com.example.ordersService.dto.request.OrderRequest;
import com.example.ordersService.dto.request.SubOrderRequest;
import com.example.ordersService.dto.request.WalletUpdateTradeRequest;
import com.example.ordersService.entity.Order;
import com.example.ordersService.entity.SubOrder;
import com.example.ordersService.repository.OrderRepository;
import com.example.ordersService.repository.httpclient.WalletClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WalletClient walletClient;

    public String generateNumberSeries() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10)); // Tạo số từ 0 đến 9
        }

        return sb.toString();
    }

    public Order createOrder(OrderRequest request) {
        // Kiểm tra nếu danh sách phương thức thanh toán rỗng
        if (request.getPaymentMethods() == null || request.getPaymentMethods().isEmpty()) {
            throw new IllegalArgumentException("Phải chọn ít nhất một phương thức thanh toán!");
        }

        // Kiểm tra nếu có phương thức không hợp lệ
        for (PaymentMethod method : request.getPaymentMethods()) {
            if (method != PaymentMethod.BANK_TRANSFER && method != PaymentMethod.WALLET_FIAT) {
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ!");
            }
        }

        // Thời gian hiện tại (thời điểm đặt lệnh)
         Date createdAt = new Date();

        Order order =  Order.builder()
                .orderId(generateNumberSeries())
                .userId(request.getUserId())
                .coin(request.getCoin())
                .amount(request.getAmount())
                .remainingAmount(request.getAmount()) // Ban đầu = số lượng đặt lệnh
                .price(request.getPrice())
                .status(Status.PENDING)
                .paymentMethods(request.getPaymentMethods()) // Nhận danh sách phương thức thanh toán từ request
                .createdAt(createdAt) // Thời điểm tạo lệnh
                .updatedAt(createdAt)
                .paymentDeadline(request.getPaymentTimeLimit())
                .minimum(request.getMinimum())
                .maximum(request.getMaximum())
                .build();

        return orderRepository.save(order);
    }

    public Order updateOrderFromBuyer(SubOrderRequest request, String id ) {

        // Tìm Order cần cập nhật
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Không tìm thấy Order!");
        }
        Order order = optionalOrder.get();

        Date createdAt = new Date();

        Status subOrderStatus = request.getPaymentMethods() == PaymentMethod.WALLET_FIAT
                ? Status.SUCCESS  // Thanh toán ngay lập tức
                : Status.IN_PROGRESS; // Chờ thanh toán nếu dùng chuyển khoản

        // Tạo SubOrder mới
        SubOrder subOrder = SubOrder.builder()
                .subOrderId(generateNumberSeries()) // Tạo ID ngẫu nhiên
                .buyerId(request.getBuyerId())
                .amount(request.getAmount())
                .status(subOrderStatus)
                .paymentMethods(request.getPaymentMethods())
                .createAt(createdAt)
                .paymentDeadline(request.getPaymentMethods() == PaymentMethod.WALLET_FIAT ? null :
                        new Date(createdAt.getTime() + (long) order.getPaymentDeadline() * 60 * 1000))
                .build();

        //deduct money in wallet fiat and add money in crypto of buyer, deduct money in crypto
        //and add money in fiat of seller

        if(request.getPaymentMethods() == PaymentMethod.WALLET_FIAT){
            WalletUpdateTradeRequest walletUpdateTradeRequest = WalletUpdateTradeRequest.builder()
                    .buyerId(subOrder.getBuyerId())
                    .sellerId(order.getUserId())
                    .amountFiat(BigDecimal.valueOf(order.getPrice()* subOrder.getAmount()))
                    .amountCrypto(BigDecimal.valueOf(subOrder.getAmount()))
                    .cryptoType(order.getCoin())
                    .build() ;

            try {
                walletClient.updateWalletTrade(walletUpdateTradeRequest);
                log.info("Wallet balance updated successfully for userId: {}", walletUpdateTradeRequest);
            } catch (Exception e) {
                log.error("Failed to update wallet balance for userId: {}. Error: {}", walletUpdateTradeRequest, e.getMessage(), e);
                // Optionally, handle the failure (e.g., retry, log, or return 0)
            }
        }

        // Kiểm tra nếu danh sách subOrders của order đang null thì khởi tạo mới
        if (order.getSubOrders() == null) {
            order.setSubOrders(new ArrayList<>()); // ✅ Khởi tạo danh sách rỗng nếu null
        }

        // Thêm vào danh sách subOrders
        order.getSubOrders().add(subOrder);

        // Cập nhật remainingAmount
        double newRemainingAmount = order.getRemainingAmount() - request.getAmount();
        if (newRemainingAmount < 0) {
            throw new RuntimeException("Số lượng không đủ!");
        }
        order.setRemainingAmount(newRemainingAmount);
        order.setUpdatedAt(new Date());


        //update status of order
        boolean allSubOrdersCompleted = order.getSubOrders() != null &&
                order.getSubOrders().stream().allMatch(sub -> sub.getStatus() == Status.SUCCESS);

        if (allSubOrdersCompleted && order.getRemainingAmount() == 0) {
            order.setStatus(Status.SUCCESS);
        }

        // Lưu lại vào MongoDB
        return orderRepository.save(order);
    }

    public List<Order> getAllOrder (){
        return orderRepository.findAll();
    }
}
