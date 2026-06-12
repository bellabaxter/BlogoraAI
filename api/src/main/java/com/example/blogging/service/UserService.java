package com.example.blogging.service;

import com.example.blogging.dto.LoginResponse;
import com.example.blogging.models.User;

public interface UserService {

    User createUser(User user);

    LoginResponse loginUser(User user);

    User findByUsername(String username);

    User findByEmail(String email);
}
