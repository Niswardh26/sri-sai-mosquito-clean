package com.example.app.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.example.app.dto.request.ProductRequest;
import com.example.app.dto.response.ProductResponse;
import com.example.app.entity.Category;
import com.example.app.entity.Product;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(@NonNull Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> filterProducts(Long categoryId, String material, String style,
                                                 Double minPrice, Double maxPrice, String name) {
        return productRepository.filterProducts(categoryId, material, style, minPrice, maxPrice, name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Long categoryId = Objects.requireNonNull(request.getCategoryId());
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setProductCode(request.getProductCode());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setMaterial(request.getMaterial());
        product.setStyle(request.getStyle());
        product.setCategory(category);
        product.setImages(request.getImages());
        product.setVideos(request.getVideos());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse updateProduct(@NonNull Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Long categoryId = Objects.requireNonNull(request.getCategoryId());
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setProductCode(request.getProductCode());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setMaterial(request.getMaterial());
        product.setStyle(request.getStyle());
        product.setCategory(category);
        product.setImages(request.getImages());
        product.setVideos(request.getVideos());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @SuppressWarnings("null")
    public void deleteProduct(@NonNull Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse resp = new ProductResponse(
                product.getId(),
                product.getName(),
                product.getProductCode(),
                product.getDescription(),
                product.getPrice(),
                product.getMaterial(),
                product.getStyle(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getImages()
        );
        resp.setVideos(product.getVideos());
        return resp;
    }
}
