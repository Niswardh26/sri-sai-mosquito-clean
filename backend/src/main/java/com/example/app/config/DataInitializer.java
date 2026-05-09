package com.example.app.config;

import com.example.app.entity.Category;
import com.example.app.entity.Role;
import com.example.app.entity.User;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedCategories();
        seedAdminUser();
    }

    private void seedCategories() {
        if (!categoryRepository.existsByNameIgnoreCase("DOOR")) {
            Category door = new Category();
            door.setName("DOOR");
            categoryRepository.save(door);
        }
        if (!categoryRepository.existsByNameIgnoreCase("WINDOW")) {
            Category window = new Category();
            window.setName("WINDOW");
            categoryRepository.save(window);
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("niswardh.k@gmail.com");
            admin.setPassword(passwordEncoder.encode("Admin@2026"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
        }
    }
}
