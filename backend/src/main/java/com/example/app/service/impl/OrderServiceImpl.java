package com.example.app.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.dto.request.OrderUpdateRequest;
import com.example.app.dto.response.OrderItemResponse;
import com.example.app.dto.response.OrderResponse;
import com.example.app.entity.Cart;
import com.example.app.entity.CartItem;
import com.example.app.entity.Order;
import com.example.app.entity.OrderItem;
import com.example.app.entity.OrderStatus;
import com.example.app.entity.User;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.CartItemRepository;
import com.example.app.repository.CartRepository;
import com.example.app.repository.OrderRepository;
import com.example.app.repository.UserRepository;
import com.example.app.service.OrderService;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public OrderResponse createOrderFromCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + username));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        // Generate unique order number
        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) 
                + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setCustomerName(user.getFirstName() != null ? user.getFirstName() + " " + user.getLastName() : username);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        // Calculate total and add items
        double totalAmount = 0.0;
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setProductCode(cartItem.getProduct().getProductCode());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            orderItem.setSubtotal(cartItem.getProduct().getPrice() * cartItem.getQuantity());
            orderItem.setNotes(cartItem.getNotes());
            order.addItem(orderItem);
            totalAmount += orderItem.getSubtotal();
        }

        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order is created
        @SuppressWarnings("null")
        List<CartItem> items = cart.getItems();
        if (items != null && !items.isEmpty()) {
            cartItemRepository.deleteAll(items);
        }
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return orderRepository.findByUserOrderByOrderDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(@NonNull Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        return mapToResponse(order);
    }

    @Override
    public OrderResponse updateOrder(@NonNull Long id, OrderUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }
        if (request.getCustomerName() != null) {
            order.setCustomerName(request.getCustomerName());
        }
        if (request.getPhone() != null) {
            order.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            order.setAddress(request.getAddress());
        }
        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }

        order.setUpdatedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse confirmOrder(@NonNull Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(LocalDateTime.now());

        Order confirmedOrder = orderRepository.save(order);
        return mapToResponse(confirmedOrder);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProductName(),
                        i.getProductCode(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getSubtotal(),
                        i.getNotes()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getCustomerName(),
                order.getPhone(),
                order.getAddress(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                itemResponses,
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}