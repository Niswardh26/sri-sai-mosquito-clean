package com.example.app.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.dto.request.CartItemRequest;
import com.example.app.dto.request.CartItemUpdateRequest;
import com.example.app.dto.request.CartSubmitRequest;
import com.example.app.dto.response.CartItemResponse;
import com.example.app.dto.response.CartResponse;
import com.example.app.dto.response.InquiryResponse;
import com.example.app.dto.response.OrderResponse;
import com.example.app.entity.Cart;
import com.example.app.entity.CartItem;
import com.example.app.entity.Inquiry;
import com.example.app.entity.Product;
import com.example.app.entity.User;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.CartItemRepository;
import com.example.app.repository.CartRepository;
import com.example.app.repository.InquiryRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.UserRepository;
import com.example.app.service.CartService;
import com.example.app.service.OrderService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private OrderService orderService;

    private Cart getOrCreateCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @Override
    public CartResponse getCart(String username) {
        Cart cart = getOrCreateCart(username);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse addItem(String username, CartItemRequest request) {
        Cart cart = getOrCreateCart(username);
        Long productId = Objects.requireNonNull(request.getProductId());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));

        // Check if product already in cart — update quantity
        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst().orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            if (request.getNotes() != null) existing.setNotes(request.getNotes());
            cartItemRepository.save(existing);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
            item.setNotes(request.getNotes());
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse updateItem(String username, @NonNull Long itemId, CartItemUpdateRequest request) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to this user");
        }

        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getNotes() != null) item.setNotes(request.getNotes());
        cartItemRepository.save(item);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse removeItem(String username, @NonNull Long itemId) {
        Cart cart = getOrCreateCart(username);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to this user");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    public void clearCart(String username) {
        Cart cart = getOrCreateCart(username);
        cart.getItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    @Override
    public InquiryResponse submitCart(String username, CartSubmitRequest request) {
        Cart cart = getOrCreateCart(username);

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        String productList = cart.getItems().stream()
                .map(i -> i.getProduct().getName() + " (x" + i.getQuantity() + ")")
                .collect(Collectors.joining(", "));

        Inquiry inquiry = new Inquiry();
        inquiry.setCustomerName(request.getCustomerName());
        inquiry.setPhone(request.getPhone());
        inquiry.setAddress(request.getAddress());
        inquiry.setMessage(request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage()
                : "Cart inquiry");
        inquiry.setProductInterest(productList);
        inquiry.setCreatedAt(LocalDateTime.now());
        inquiryRepository.save(inquiry);

        // Create order from cart
        // Set customer info in cart for order creation
        cart.setUpdatedAt(LocalDateTime.now());

        // Create order using OrderService
        OrderResponse orderResponse = orderService.createOrderFromCart(username);

        // Update order with customer details
        com.example.app.dto.request.OrderUpdateRequest orderUpdateRequest = new com.example.app.dto.request.OrderUpdateRequest();
        orderUpdateRequest.setCustomerName(request.getCustomerName());
        orderUpdateRequest.setPhone(request.getPhone());
        orderUpdateRequest.setAddress(request.getAddress());
        orderUpdateRequest.setNotes(request.getMessage());
        Long orderId = Objects.requireNonNull(orderResponse.getId());
        orderService.updateOrder(orderId, orderUpdateRequest);

        return new InquiryResponse(
                inquiry.getId(),
                inquiry.getCustomerName(),
                inquiry.getPhone(),
                inquiry.getAddress(),
                inquiry.getMessage(),
                inquiry.getProductInterest(),
                inquiry.getCreatedAt()
        );
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(i -> new CartItemResponse(
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getProductCode(),
                        i.getProduct().getPrice(),
                        i.getProduct().getCategory() != null ? i.getProduct().getCategory().getName() : null,
                        i.getQuantity(),
                        i.getNotes()
                ))
                .collect(Collectors.toList());
        return new CartResponse(cart.getId(), cart.getUser().getUsername(), itemResponses);
    }
}
