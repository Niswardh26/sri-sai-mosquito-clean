package com.example.app.dto.response;

public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private Double price;
    private String categoryName;
    private Integer quantity;
    private String notes;

    public CartItemResponse() {}

    public CartItemResponse(Long id, Long productId, String productName, String productCode,
                             Double price, String categoryName, Integer quantity, String notes) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productCode = productCode;
        this.price = price;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
