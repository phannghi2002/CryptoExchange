package com.example.ordersService.service;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import com.example.ordersService.dto.request.BankRequest;
import com.example.ordersService.dto.request.OrderRequest;
import com.example.ordersService.dto.request.SubOrderRequest;
import com.example.ordersService.dto.request.WalletUpdateTradeRequest;
import com.example.ordersService.entity.Bank;
import com.example.ordersService.entity.Order;
import com.example.ordersService.entity.SubOrder;
import com.example.ordersService.repository.BankRepository;
import com.example.ordersService.repository.OrderRepository;
import com.example.ordersService.repository.httpclient.WalletClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;


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

//    public Order createOrder(OrderRequest request) {
//        // Kiểm tra nếu danh sách phương thức thanh toán rỗng
//        if (request.getPaymentMethods() == null || request.getPaymentMethods().isEmpty()) {
//            throw new IllegalArgumentException("Phải chọn ít nhất một phương thức thanh toán!");
//        }
//
//        // Kiểm tra nếu có phương thức không hợp lệ
//        for (PaymentMethod method : request.getPaymentMethods()) {
//            if (method != PaymentMethod.BANK_TRANSFER && method != PaymentMethod.WALLET_FIAT) {
//                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ!");
//            }
//        }
//
//        // Thời gian hiện tại (thời điểm đặt lệnh)
//         Date createdAt = new Date();
//
//        Order order =  Order.builder()
//                .orderId(generateNumberSeries())
//                .userId(request.getUserId())
//                .coin(request.getCoin())
//                .amount(request.getAmount())
//                .remainingAmount(request.getAmount()) // Ban đầu = số lượng đặt lệnh
//                .price(request.getPrice())
//                .status(Status.PENDING)
//                .paymentMethods(request.getPaymentMethods()) // Nhận danh sách phương thức thanh toán từ request
//                .createdAt(createdAt) // Thời điểm tạo lệnh
//                .updatedAt(createdAt)
//                .paymentDeadline(request.getPaymentTimeLimit())
//                .minimum(request.getMinimum())
//                .maximum(request.getMaximum())
//                .policy(request.getPolicy())
//                .build();
//
//        return orderRepository.save(order);
//    }

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

        // Kiểm tra xem paymentMethods có chứa BANK_TRANSFER hay không
        boolean hasBankTransfer = request.getPaymentMethods().contains(PaymentMethod.BANK_TRANSFER);

        // Khởi tạo builder
        Order.OrderBuilder orderBuilder = Order.builder()
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
                .minimum(request.getMinimum())
                .maximum(request.getMaximum())
                .policy(request.getPolicy());

        // Chỉ thêm paymentDeadline nếu có BANK_TRANSFER
        if (hasBankTransfer) {
            orderBuilder.paymentDeadline(request.getPaymentTimeLimit());
        }

        // Xây dựng và lưu Order
        Order order = orderBuilder.build();
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

    public List<Order> getAnotherOrder (String userId){
        return orderRepository.findByUserIdNot(userId);
    }

    public List<Order> getMyOrder (String userId){
        return orderRepository.findByUserId(userId);
    }

//    public Page<Order> getAllOrders(int page, int size) {
//        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
//        // Tạo Pageable object với số trang (page) và kích thước trang (size)
//        Pageable pageable = PageRequest.of(page, size, sort);
//        // Gọi repository để lấy dữ liệu phân trang
//        return orderRepository.findAll(pageable);
//    }
public Page<Order> getAllOrders(String userId, int page, int size) {
    Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
    // Tạo Pageable object với số trang (page) và kích thước trang (size)
    Pageable pageable = PageRequest.of(page, size, sort);
    // Gọi repository để lấy dữ liệu phân trang
    return orderRepository.findAllByUserId(pageable, userId);
}

    
    public List<Order> getOrdersByFilters(String coin, String paymentMethod, BigDecimal price) {
        List<Order> orders;

        if (coin != null && paymentMethod != null) {
            orders = orderRepository.findByCoinAndPaymentMethodsContainingIgnoreCase(coin, paymentMethod);
        } else if (coin != null) {
            orders = orderRepository.findByCoin(coin);
        } else if (paymentMethod != null) {
            orders = orderRepository.findByPaymentMethodsContainingIgnoreCase(paymentMethod);
        } else {
            orders = orderRepository.findAll();
        }

        // Lọc theo giá nếu người dùng truyền vào
        if (price != null) {
            orders = orders.stream()
                    .filter(o ->
                            o.getMinimum() != null &&
                                    o.getMaximum() != null &&
                                    price.compareTo(o.getMinimum()) >= 0 &&
                                    price.compareTo(o.getMaximum()) <= 0
                    )
                    .collect(Collectors.toList());
        }

        return orders;
    }

    public List<Order> getOrderPending(String userId) {
        return orderRepository.findByUserIdAndStatus(userId, Status.PENDING);
    }

    public List<Order> getOrderHistory(String userId) {
        return orderRepository.findByUserIdAndStatus(userId, Status.FINISH);
    }

    public List<Order> getAnotherOrdersByFilters(String userId, String coin, String paymentMethod, BigDecimal price) {
        List<Order> orders;

        if (coin != null && paymentMethod != null) {
            orders = orderRepository.findByUserIdNotAndCoinAndPaymentMethodsContainingIgnoreCase(userId, coin, paymentMethod);
        } else if (coin != null) {
            orders = orderRepository.findByUserIdNotAndCoin(userId, coin);
        } else if (paymentMethod != null) {
            orders = orderRepository.findByUserIdNotAndPaymentMethodsContainingIgnoreCase(userId, paymentMethod);
        } else {
            orders = orderRepository.findByUserIdNot(userId);
        }

        // Lọc theo giá nếu người dùng truyền vào
        if (price != null) {
            orders = orders.stream()
                    .filter(o ->
                            o.getMinimum() != null &&
                                    o.getMaximum() != null &&
                                    price.compareTo(o.getMinimum()) >= 0 &&
                                    price.compareTo(o.getMaximum()) <= 0
                    )
                    .collect(Collectors.toList());
        }

        return orders;
    }


    public void cancelOrder(String id) {
        // Tìm Order từ cơ sở dữ liệu dựa vào id
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isEmpty()) {
            System.out.println("Không tìm thấy lệnh với ID: " + id);
            throw new NoSuchElementException("Lệnh không tồn tại.");
        }

        Order order = optionalOrder.get();

        // Kiểm tra nếu không có SubOrder nào
        if (order.getSubOrders() == null || order.getSubOrders().isEmpty()) {
            order.setStatus(Status.FINISH);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);
            System.out.println("Đã hủy lệnh: " + order.getOrderId());
            return;
        }

        // Kiểm tra nếu tất cả các SubOrder đều ở trạng thái SUCCESS
        boolean allSuccess = order.getSubOrders().stream()
                .allMatch(subOrder -> subOrder.getStatus() == Status.SUCCESS);

        if (allSuccess) {
            order.setStatus(Status.FINISH);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);
            System.out.println("Đã hủy lệnh: " + order.getId());
        } else {
            System.out.println("Không thể hủy lệnh vì có SubOrder chưa hoàn thành.");
            throw new IllegalStateException("Không thể hủy lệnh do có SubOrder chưa hoàn thành.");
        }
    }



    @Autowired
    private BankRepository bankRepository;

    public Bank createBank(BankRequest request) {
        Optional<Bank> existingBank = bankRepository.findByUserId(request.getUserId());

        if (existingBank.isPresent()) {
            throw new IllegalStateException("User already has a bank account.");
        }

        return bankRepository.save(Bank.builder()
                .userId(request.getUserId())
                .nameBank(request.getNameBank())
                .numberAccount(request.getNumberAccount())
                .nameAccount(request.getNameAccount().toUpperCase())
                .contentPay(request.getContentPay())
                .build());
    }

    public Optional<Bank> getBank (String userId){

        log.info("ko chay à");
        Optional<Bank> existingBank = bankRepository.findByUserId(userId);

        if (existingBank.isEmpty()) {
            throw new IllegalStateException("User not exist.");
        }
        return bankRepository.findByUserId(userId);
    }


}
