package com.example.app.service;

import com.example.app.dto.response.CategoryResponse;
import java.util.List;

import org.springframework.lang.NonNull;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(@NonNull Long id);
}
