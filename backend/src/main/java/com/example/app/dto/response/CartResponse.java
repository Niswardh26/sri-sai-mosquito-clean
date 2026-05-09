package com.example.app.dto.response;

import java.util.List;

public class CartResponse {
    private Long id;
    private String username;
    private List<CartItemResponse> items;
    private int totalItems;

    public CartResponse() {}

    public CartResponse(Long id, String username, List<CartItemResponse> items) {
        this.id = id;
        this.username = username;
        this.items = items;
        this.totalItems = items != null ? items.stream().mapToInt(CartItemResponse::getQuantity).sum() : 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) {
        this.items = items;
        this.totalItems = items != null ? items.stream().mapToInt(CartItemResponse::getQuantity).sum() : 0;
    }

    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
}
