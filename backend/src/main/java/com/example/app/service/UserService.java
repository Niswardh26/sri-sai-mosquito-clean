package com.example.app.service;

import com.example.app.dto.request.LoginRequest;
import com.example.app.dto.request.RegisterRequest;
import com.example.app.dto.response.AuthResponse;
import com.example.app.dto.response.UserResponse;

import org.springframework.lang.NonNull;

public interface UserService {

    AuthResponse registerUser(RegisterRequest registerRequest);

    AuthResponse loginUser(LoginRequest loginRequest);

    UserResponse getUserById(@NonNull Long userId);

    UserResponse getUserByUsername(String username);

    void deleteUser(@NonNull Long userId);

}
