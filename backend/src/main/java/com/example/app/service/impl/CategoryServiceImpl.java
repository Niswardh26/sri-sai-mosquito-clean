package com.example.app.service.impl;

import com.example.app.dto.response.CategoryResponse;
import com.example.app.exception.ResourceNotFoundException;
import com.example.app.repository.CategoryRepository;
import com.example.app.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(@NonNull Long id) {
        return categoryRepository.findById(id)
                .map(c -> new CategoryResponse(c.getId(), c.getName()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
