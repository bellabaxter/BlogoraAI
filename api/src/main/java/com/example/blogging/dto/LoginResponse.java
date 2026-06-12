package com.example.blogging.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;

    public LoginResponse(String token, String email, String name) {
        this.token = token;
        this.email = email;
        this.name = name;
    }
}