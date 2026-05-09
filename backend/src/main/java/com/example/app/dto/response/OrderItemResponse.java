package com.example.app.dto.response;

public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
    private String notes;

    public OrderItemResponse() {}

    public OrderItemResponse(Long id, Long productId, String productName,
                            String productCode, Integer quantity,
                            Double unitPrice, Double subtotal, String notes) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productCode = productCode;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}