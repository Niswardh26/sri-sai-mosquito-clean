package com.example.app.dto.response;

import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String productCode;
    private String description;
    private Double price;
    private String material;
    private String style;
    private String categoryName;
    private Long categoryId;
    private List<String> images;
    private List<String> videos;

    public ProductResponse() {}

    public ProductResponse(Long id, String name, String productCode, String description,
                           Double price, String material, String style, String categoryName,
                           Long categoryId, List<String> images) {
        this.id = id;
        this.name = name;
        this.productCode = productCode;
        this.description = description;
        this.price = price;
        this.material = material;
        this.style = style;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.images = images;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = videos; }
}
