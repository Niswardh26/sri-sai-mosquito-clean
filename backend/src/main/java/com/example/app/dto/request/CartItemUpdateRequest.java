package com.example.app.dto.request;

import jakarta.validation.constraints.Min;

public class CartItemUpdateRequest {

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private String notes;

    // getters & setters
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}