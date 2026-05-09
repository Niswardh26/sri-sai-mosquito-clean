package com.example.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private String email;
    private String message;
    private String role;

    public AuthResponse(String token, String username, String email, String message) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.message = message;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

}
