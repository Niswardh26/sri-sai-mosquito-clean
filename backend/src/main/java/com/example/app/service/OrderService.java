package com.example.app.service;

import java.util.List;

import com.example.app.dto.request.OrderUpdateRequest;
import com.example.app.dto.response.OrderResponse;

import org.springframework.lang.NonNull;

public interface OrderService {

    OrderResponse createOrderFromCart(String username);

    List<OrderResponse> getUserOrders(String username);

    OrderResponse getOrderById(@NonNull Long id);

    OrderResponse updateOrder(@NonNull Long id, OrderUpdateRequest request);

    List<OrderResponse> getAllOrders();

    OrderResponse confirmOrder(@NonNull Long id);
}