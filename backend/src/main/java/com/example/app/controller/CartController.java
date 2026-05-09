package com.example.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.request.CartItemRequest;
import com.example.app.dto.request.CartItemUpdateRequest;
import com.example.app.dto.request.CartSubmitRequest;
import com.example.app.dto.response.CartResponse;
import com.example.app.dto.response.InquiryResponse;
import com.example.app.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(Authentication auth,
                                                 @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(auth.getName(), request));
    }

@PutMapping("/items/{itemId}")
public ResponseEntity<?> updateItem(Authentication auth,
                                    @PathVariable @NonNull Long itemId,
                                    @Valid @RequestBody CartItemUpdateRequest request) {
    return ResponseEntity.ok(cartService.updateItem(auth.getName(), itemId, request));
}

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(Authentication auth,
                                                    @PathVariable @NonNull Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(auth.getName(), itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<InquiryResponse> submitCart(Authentication auth,
                                                       @Valid @RequestBody CartSubmitRequest request) {
        return ResponseEntity.ok(cartService.submitCart(auth.getName(), request));
    }
}
