package com.example.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.app.dto.request.OrderUpdateRequest;
import com.example.app.dto.response.OrderResponse;
import com.example.app.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Customer: Get their own orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
    }

    // Customer: Get order details
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // Admin: Get all orders
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin: Update order (status, customer info, etc.)
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable @NonNull Long id,
                                                      @RequestBody OrderUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(id, request));
    }

    // Admin: Confirm order
    @PutMapping("/admin/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> confirmOrder(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(orderService.confirmOrder(id));
    }
}