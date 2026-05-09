package com.example.app.service;

import com.example.app.dto.request.CartItemRequest;
import com.example.app.dto.request.CartItemUpdateRequest;
import com.example.app.dto.request.CartSubmitRequest;
import com.example.app.dto.response.CartResponse;
import com.example.app.dto.response.InquiryResponse;

import jakarta.validation.Valid;

import org.springframework.lang.NonNull;

public interface CartService {
    CartResponse getCart(String username);
    CartResponse addItem(String username, @Valid CartItemRequest request);
    CartResponse updateItem(String username, @NonNull Long itemId, @Valid CartItemUpdateRequest request);
    CartResponse removeItem(String username, @NonNull Long itemId);
    void clearCart(String username);
    InquiryResponse submitCart(String username, @Valid CartSubmitRequest request);
}
