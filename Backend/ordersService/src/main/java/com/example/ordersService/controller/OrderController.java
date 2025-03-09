package com.example.ordersService.controller;

import com.example.ordersService.dto.request.OrderRequest;
import com.example.ordersService.dto.request.SubOrderRequest;
import com.example.ordersService.entity.Order;
import com.example.ordersService.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderRequest request){
        return orderService.createOrder(request);
    }

    @PutMapping("/updateOrder/{id}")
    public Order updateBuyerOrder(@RequestBody SubOrderRequest request, @PathVariable String id){
        return orderService.updateOrderFromBuyer(request, id);
    }

    @GetMapping("/getAllOrder")
    public List<Order> getAllOrder(){
        return orderService.getAllOrder();
    }
}
