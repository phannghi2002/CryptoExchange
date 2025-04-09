package com.example.ordersService.controller;

import com.example.ordersService.constant.Status;
import com.example.ordersService.dto.request.BankRequest;
import com.example.ordersService.dto.request.OrderRequest;
import com.example.ordersService.dto.request.SubOrderRequest;
import com.example.ordersService.dto.response.OrderNotifyResponse;
import com.example.ordersService.dto.response.PagedResponse;
import com.example.ordersService.dto.response.SubOrderWithCoinDTO;
import com.example.ordersService.entity.Bank;
import com.example.ordersService.entity.Order;
import com.example.ordersService.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @PutMapping("/updateOrder/{id}")
    public Order updateBuyerOrder(@RequestBody SubOrderRequest request, @PathVariable String id) {
        return orderService.updateOrderFromBuyer(request, id);
    }

    @PutMapping("/updateOrderReturnSubId/{id}")
    public String updateBuyerOrderReturnSubId(@RequestBody SubOrderRequest request, @PathVariable String id) {
        return orderService.updateOrderReturnSubIdFromBuyer(request, id);
    }

    @PutMapping("/updateStatusOfBankTransfer")
    public Order updateStatusOfBankTransfer(@RequestParam String orderId,
                                             @RequestParam String subOrderId,
                                             @RequestParam Status status
                                             ) {
        return orderService.updateStatusOfBankTransfer(orderId, subOrderId, status);
    }

    @GetMapping("/getOrder/{orderId}")
    public Order getOrder(@PathVariable String orderId){
        return orderService.getOrder(orderId);
    }

    @GetMapping("/getAllOrder")
    public List<Order> getAllOrder() {
        return orderService.getAllOrder();
    }

    @GetMapping("/getAnotherOrder/{userId}")
    public List<Order> getAnotherOrder(@PathVariable String userId) {
        return orderService.getAnotherOrder(userId);
    }

    @GetMapping("/getAnotherOrderPending/{userId}")
    public List<Order> getAnotherOrderPending(@PathVariable String userId) {
        return orderService.getAnotherOrderPending(userId);
    }

    @GetMapping("/getMyOrder/{userId}")
    public List<Order> getMyOrder(@PathVariable String userId) {
        return orderService.getMyOrder(userId);
    }

    @GetMapping("/getOrderPagination")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(required = true) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Page<Order> orders = orderService.getAllOrders(userId, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/getOrder")
    public List<Order> getOrdersByCoinAndPaymentMethod(
            @RequestParam(required = false) String coin,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) BigDecimal price
    ) {

        return orderService.getOrdersByFilters(coin, paymentMethod, price);
    }

    @GetMapping("/getAnotherOrder")
    public List<Order> getAnotherUserIdOrdersByCoinAndPaymentMethod(
            @RequestParam(required = true) String userId,
            @RequestParam(required = false) String coin,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) BigDecimal price
    ) {

        return orderService.getAnotherOrdersByFilters(userId, coin, paymentMethod, price);
    }

    @GetMapping("/getAnotherOrderPending")
    public List<Order> getAnotherPendingUserIdOrdersByCoinAndPaymentMethod(
            @RequestParam(required = true) String userId,
            @RequestParam(required = false) String coin,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) BigDecimal price
    ) {

        return orderService.getAnotherPendingOrdersByFilters(userId, coin, paymentMethod, price);
    }

    @GetMapping("/getOrderPending/{userId}")
    public List<Order> getOrderPending(@PathVariable String userId) {
        return orderService.getOrderPending(userId);
    }

    @GetMapping("/getOrderHistory/{userId}")
    public List<Order> getOrderHistory(@PathVariable String userId) {
        return orderService.getOrderHistory(userId);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable String id) {
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.ok().body(Map.of(
                    "status", "success",
                    "message", "Lệnh đã được hủy thành công."
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "error",
                    "message", "Không tìm thấy lệnh với ID: " + id
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Đã xảy ra lỗi trong quá trình hủy lệnh."
            ));
        }
    }

    @GetMapping("/{orderId}/suborders/{subOrderId}")
    public OrderNotifyResponse getOrderNotify(
            @PathVariable String orderId,
            @PathVariable String subOrderId) {
        return orderService.getOrderNotify(orderId, subOrderId);
    }


    @GetMapping("/suborder-ids/by-group")
    public ResponseEntity<List<SubOrderWithCoinDTO>> getSubOrdersByGroup(
            @RequestParam String userId,
            @RequestParam(required = false, defaultValue = "GROUP_1") String group
    ) {
        List<SubOrderWithCoinDTO> subOrders = orderService.getSubOrdersByGroup(userId, group);
        return ResponseEntity.ok(subOrders);
    }

    @GetMapping("/another-pending")
    public ResponseEntity<PagedResponse<Order>> getAnotherOrderPending(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PagedResponse<Order> response = orderService.getAnotherOrderPending(userId, page);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-order-pending")
    public ResponseEntity<PagedResponse<Order>> getMyOrderPending(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PagedResponse<Order> response = orderService.getMyOrderPending(userId, page);
        return ResponseEntity.ok(response);
    }



    @PostMapping("/create-bank")
    public Bank createBank(@RequestBody BankRequest request) {
        return orderService.createBank(request);
    }

    @GetMapping("/get-bank/{userId}")
    public Optional<Bank> getBank(@PathVariable String userId) {
        return orderService.getBank(userId);
    }
}
