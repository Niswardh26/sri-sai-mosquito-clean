package com.example.app.dto.response;

import java.time.LocalDateTime;

public class InquiryResponse {
    private Long id;
    private String customerName;
    private String phone;
    private String address;
    private String message;
    private String productInterest;
    private LocalDateTime createdAt;

    public InquiryResponse() {}

    public InquiryResponse(Long id, String customerName, String phone, String address,
                            String message, String productInterest, LocalDateTime createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.phone = phone;
        this.address = address;
        this.message = message;
        this.productInterest = productInterest;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getProductInterest() { return productInterest; }
    public void setProductInterest(String productInterest) { this.productInterest = productInterest; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
