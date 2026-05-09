package com.example.app.service;

import com.example.app.dto.request.ProductRequest;
import com.example.app.dto.response.ProductResponse;

import org.springframework.lang.NonNull;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(@NonNull Long id);
    List<ProductResponse> filterProducts(Long categoryId, String material, String style,
                                         Double minPrice, Double maxPrice, String name);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(@NonNull Long id, ProductRequest request);
    void deleteProduct(@NonNull Long id);
}
