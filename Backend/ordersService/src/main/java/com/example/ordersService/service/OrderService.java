package com.example.ordersService.service;

import com.example.ordersService.constant.PaymentMethod;
import com.example.ordersService.constant.Status;
import com.example.ordersService.dto.request.*;
import com.example.ordersService.dto.response.OrderNotifyResponse;
import com.example.ordersService.dto.response.PagedResponse;
import com.example.ordersService.dto.response.SubOrderWithCoinDTO;
import com.example.ordersService.entity.Bank;
import com.example.ordersService.entity.Order;
import com.example.ordersService.entity.SubOrder;
import com.example.ordersService.repository.BankRepository;
import com.example.ordersService.repository.OrderRepository;
import com.example.ordersService.repository.httpclient.NotifyClient;
import com.example.ordersService.repository.httpclient.WalletClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
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

    @Autowired
    private KafkaTemplate<String, Map<String, Object>> kafkaTemplate;

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

    public Order updateOrderFromBuyer(SubOrderRequest request, String id) {

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
                .priceVnd(request.getPriceVnd())
                .status(subOrderStatus)
                .paymentMethods(request.getPaymentMethods())
                .createAt(createdAt)
                .paymentDeadline(request.getPaymentMethods() == PaymentMethod.WALLET_FIAT ? null :
                        new Date(createdAt.getTime() + (long) order.getPaymentDeadline() * 60 * 1000))
                .build();

        //deduct money in wallet fiat and add money in crypto of buyer, deduct money in crypto
        //and add money in fiat of seller

        if (request.getPaymentMethods() == PaymentMethod.WALLET_FIAT) {
            WalletUpdateTradeRequest walletUpdateTradeRequest = WalletUpdateTradeRequest.builder()
                    .buyerId(subOrder.getBuyerId())
                    .sellerId(order.getUserId())
                    .amountFiat(BigDecimal.valueOf(order.getPrice() * subOrder.getAmount()))
                    .amountCrypto(BigDecimal.valueOf(subOrder.getAmount()))
                    .cryptoType(order.getCoin())
                    .build();

//            try {
//                walletClient.updateWalletTrade(walletUpdateTradeRequest);
//                log.info("Wallet balance updated successfully for userId: {}", walletUpdateTradeRequest);
//            } catch (Exception e) {
//                log.error("Failed to update wallet balance for userId: {}. Error: {}", walletUpdateTradeRequest, e.getMessage(), e);
//                // Optionally, handle the failure (e.g., retry, log, or return 0)
//            }
        }
//        else {
//            ChangeCoinRequest changeCoinRequest = ChangeCoinRequest.builder()
//                    .currency(order.getCoin())
//                    .amount(BigDecimal.valueOf(subOrder.getAmount()))
//                    .build();
//
//            try {
//                walletClient.substractCoinWallet(order.getUserId(),changeCoinRequest );
//                log.info("Substract coin of user success for userId: {}", order.getUserId());
//            } catch (Exception e) {
//                log.error("Failed to substract coin balance for userId: {}. Error: {}",  order.getUserId(), e.getMessage(), e);
//                // Optionally, handle the failure (e.g., retry, log, or return 0)
//            }
//        }

        // Kiểm tra nếu danh sách subOrders của order đang null thì khởi tạo mới
        if (order.getSubOrders() == null) {
            order.setSubOrders(new ArrayList<>()); //  Khởi tạo danh sách rỗng nếu null
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

    public String updateOrderReturnSubIdFromBuyer(SubOrderRequest request, String id) {
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
                .priceVnd(request.getPriceVnd())
                .status(subOrderStatus)
                .paymentMethods(request.getPaymentMethods())
                .createAt(createdAt)
                .paymentDeadline(request.getPaymentMethods() == PaymentMethod.WALLET_FIAT ? null :
                        new Date(createdAt.getTime() + (long) order.getPaymentDeadline() * 60 * 1000))
                .build();

        // Xử lý ví và giao dịch
        if (request.getPaymentMethods() == PaymentMethod.WALLET_FIAT) {
            WalletUpdateTradeRequest walletUpdateTradeRequest = WalletUpdateTradeRequest.builder()
                    .buyerId(subOrder.getBuyerId())
                    .sellerId(order.getUserId())
                    .amountFiat(BigDecimal.valueOf(order.getPrice() * subOrder.getAmount()))
                    .amountCrypto(BigDecimal.valueOf(subOrder.getAmount()))
                    .cryptoType(order.getCoin())
                    .build();

//            try {
//                walletClient.updateWalletTrade(walletUpdateTradeRequest);
//                log.info("Wallet balance updated successfully for userId: {}", walletUpdateTradeRequest);
//            } catch (Exception e) {
//                log.error("Failed to update wallet balance for userId: {}. Error: {}", walletUpdateTradeRequest, e.getMessage(), e);
//            }
        }

        // Khởi tạo danh sách subOrders nếu null
        if (order.getSubOrders() == null) {
            order.setSubOrders(new ArrayList<>());
        }

        // Thêm subOrder vào danh sách
        order.getSubOrders().add(subOrder);

        // Cập nhật remainingAmount
        double newRemainingAmount = order.getRemainingAmount() - request.getAmount();
        if (newRemainingAmount < 0) {
            throw new RuntimeException("Số lượng không đủ!");
        }
        order.setRemainingAmount(newRemainingAmount);
        order.setUpdatedAt(new Date());

        // Cập nhật trạng thái Order
        boolean allSubOrdersCompleted = order.getSubOrders() != null &&
                order.getSubOrders().stream().allMatch(sub -> sub.getStatus() == Status.SUCCESS);

        if (allSubOrdersCompleted && order.getRemainingAmount() == 0) {
            order.setStatus(Status.SUCCESS);
        }

        // Lưu lại vào MongoDB
        orderRepository.save(order);

        // Trả về subOrderId
        return subOrder.getSubOrderId();
    }

    public Order updateStatusOfBankTransfer(String orderId, String subOrderId, Status newStatus) {
        // Tìm Order theo orderId
        Optional<Order> optionalOrder = Optional.ofNullable(orderRepository.findByOrderId(orderId));
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Không tìm thấy Order với ID: " + orderId);
        }
        Order order = optionalOrder.get();

        // Tìm SubOrder theo subOrderId trong danh sách subOrders
        SubOrder targetSubOrder = order.getSubOrders().stream()
                .filter(subOrder -> subOrder.getSubOrderId().equals(subOrderId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubOrder với ID: " + subOrderId));

        // Kiểm tra trạng thái hiện tại và cập nhật
//        if (targetSubOrder.getStatus() == Status.IN_PROGRESS) {
//            targetSubOrder.setStatus(newStatus);
//            order.setUpdatedAt(new Date());
//        }

        targetSubOrder.setStatus(newStatus);
        order.setUpdatedAt(new Date());

        if(newStatus == Status.NOT_PAYMENT){
            orderRepository.save(order);
        }

        // Gửi sự kiện Kafka dựa trên trạng thái mới
        Map<String, Object> event = new HashMap<>();
        event.put("orderId", orderId);
        event.put("subOrderId", targetSubOrder.getSubOrderId());
        event.put("buyerId", targetSubOrder.getBuyerId());
        event.put("sellerId", order.getUserId());


        if (newStatus == Status.PENDING) {
            event.put("amount", targetSubOrder.getAmount());
            event.put("priceVnd", targetSubOrder.getPriceVnd());
            event.put("status", "PAYMENT_SUBMITTED");
            orderRepository.save(order); // Lưu trước
            kafkaTemplate.send("order-events", event); // Gửi Map trực tiếp
        } else if (newStatus == Status.SUCCESS) {
            event.put("status", "PAYMENT_CONFIRMED");
            orderRepository.save(order); // Lưu trước

            ChangeCoinRequest request = ChangeCoinRequest.builder()
                    .amount(BigDecimal.valueOf(targetSubOrder.getAmount()))
                    .currency(order.getCoin())
                    .build();

            walletClient.addCoinWallet(targetSubOrder.getBuyerId(), request);

            kafkaTemplate.send("order-wallet-events", event); // Gửi Map trực tiếp
        }

        return order;
    }

    public Order getOrder(String orderId) {
        return orderRepository.findByOrderId(orderId);
    }

    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    public List<Order> getAnotherOrder(String userId) {
        return orderRepository.findByUserIdNot(userId);
    }

    public List<Order> getAnotherOrderPending(String userId) {
        return orderRepository.findByUserIdNotAndStatus(userId,Status.PENDING);
    }

    public PagedResponse<Order> getAnotherOrderPending(String userId, int page) {
        int pageSize = 6;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> resultPage = orderRepository.findByUserIdNotAndStatus(userId, Status.PENDING, pageable);

        return new PagedResponse<>(
                resultPage.getContent(),
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getTotalElements(),
                resultPage.getSize()
        );
    }

    public PagedResponse<Order> getMyOrderPending(String userId, int page) {
        int pageSize = 6;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> resultPage = orderRepository.findByUserIdAndStatus(userId, Status.PENDING, pageable);

        return new PagedResponse<>(
                resultPage.getContent(),
                resultPage.getNumber(),
                resultPage.getTotalPages(),
                resultPage.getTotalElements(),
                resultPage.getSize()
        );
    }

    public List<Order> getMyOrder(String userId) {
        return orderRepository.findByUserId(userId);
    }

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

    public List<Order> getAnotherPendingOrdersByFilters(String userId, String coin, String paymentMethod, BigDecimal price) {
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

        // Lọc theo status PENDING
        orders = orders.stream()
                .filter(o -> o.getStatus() == Status.PENDING)
                .collect(Collectors.toList());

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
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isEmpty()) {
            throw new NoSuchElementException("Lệnh không tồn tại.");
        }

        Order order = optionalOrder.get();
        List<SubOrder> subOrders = order.getSubOrders();

        if (subOrders == null || subOrders.isEmpty()) {
            order.setStatus(Status.FINISH);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);

            refundToWallet(order.getUserId(), order.getCoin(),
                    BigDecimal.valueOf(order.getRemainingAmount()));
            return;
        }

        // Check nếu có SubOrder ở trạng thái PENDING → không cho huỷ
        boolean hasPending = subOrders.stream()
                .anyMatch(subOrder -> subOrder.getStatus() == Status.PENDING);
        if (hasPending) {
            throw new IllegalStateException("Không thể hủy lệnh do có SubOrder đang chờ xác nhận.");
        }

        // Check nếu có SubOrder IN_PROGRESS
        List<SubOrder> inProgressSubOrders = subOrders.stream()
                .filter(subOrder -> subOrder.getStatus() == Status.IN_PROGRESS)
                .collect(Collectors.toList());

        for (SubOrder subOrder : inProgressSubOrders) {
            if (subOrder.getPaymentDeadline() != null && subOrder.getPaymentDeadline().after(new Date())) {
                throw new IllegalStateException("Lệnh đang trong quá trình thanh toán, không thể hủy vào lúc này.");
            }
        }

        // Nếu toàn bộ là SUCCESS → hoàn lại remainingAmount
        boolean allSuccess = subOrders.stream()
                .allMatch(subOrder -> subOrder.getStatus() == Status.SUCCESS);

        order.setStatus(Status.FINISH);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);

        if (allSuccess) {
            refundToWallet(order.getUserId(), order.getCoin(),
                    BigDecimal.valueOf(order.getRemainingAmount()));
        } else {

            BigDecimal remaining = BigDecimal.valueOf(order.getRemainingAmount());

            BigDecimal extraRefund = subOrders.stream()
                    .filter(subOrder ->
                            (subOrder.getStatus() == Status.NOT_PAYMENT) ||
                                    (subOrder.getStatus() == Status.IN_PROGRESS &&
                                            subOrder.getPaymentDeadline() != null &&
                                            subOrder.getPaymentDeadline().before(new Date()))
                    )
                    .map(subOrder -> BigDecimal.valueOf(subOrder.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRefund = remaining.add(extraRefund);
            refundToWallet(order.getUserId(), order.getCoin(), totalRefund);

        }
    }

    private void refundToWallet(String userId, String coin, BigDecimal amount) {
        ChangeCoinRequest request = ChangeCoinRequest.builder()
                .currency(coin)
                .amount(amount)
                .build();

        walletClient.addCoinWallet(userId, request);
    }

    public OrderNotifyResponse getOrderNotify(String orderId, String subOrderId) {
        Order order = orderRepository.findByOrderId(orderId);
        if (order == null) {
            return null; // Hoặc throw exception nếu không tìm thấy đơn hàng
        }
        SubOrder foundSubOrder = order.getSubOrders().stream()
                .filter(subOrder -> subOrder.getSubOrderId().equals(subOrderId))
                .findFirst()
                .orElse(null); // Hoặc throw exception nếu không tìm thấy subOrder

        if (foundSubOrder == null) {
            return null; // Hoặc throw exception nếu không tìm thấy subOrder
        }

        return OrderNotifyResponse.builder()
                .orderId(order.getOrderId())
                .priceVnd(foundSubOrder.getPriceVnd())
                .subOrderId(foundSubOrder.getSubOrderId())
                .buyerId(foundSubOrder.getBuyerId())
                .amount(foundSubOrder.getAmount())
                .build();
    }

    public List<SubOrderWithCoinDTO> getSubOrdersByGroup(String userId, String group) {
        List<String> group1Statuses = Arrays.asList("SUCCESS", "NOT_PAYMENT");
        List<String> group2Statuses = Arrays.asList("PENDING", "IN_PROGRESS");

        List<String> statusesToFilter;
        if ("GROUP_1".equalsIgnoreCase(group)) {
            statusesToFilter = group1Statuses;
        } else if ("GROUP_2".equalsIgnoreCase(group)) {
            statusesToFilter = group2Statuses;
        } else {
            statusesToFilter = new ArrayList<>();
            statusesToFilter.addAll(group1Statuses);
            statusesToFilter.addAll(group2Statuses);
        }

        return orderRepository.findSubOrdersWithBuyerIdAndStatuses(userId, statusesToFilter);
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

    public Optional<Bank> getBank(String userId) {

        log.info("ko chay à");
        Optional<Bank> existingBank = bankRepository.findByUserId(userId);

        if (existingBank.isEmpty()) {
            throw new IllegalStateException("User not exist.");
        }
        return bankRepository.findByUserId(userId);
    }


}
