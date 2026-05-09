package com.example.app.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String productCode;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private String material;

    private String style;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private List<String> images;
    private List<String> videos;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = videos; }
}
