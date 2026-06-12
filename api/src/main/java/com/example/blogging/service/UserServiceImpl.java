package com.example.blogging.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.blogging.config.JwtUtil;
import com.example.blogging.dto.LoginResponse;
import com.example.blogging.models.User;
import com.example.blogging.repo.UserRepo;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public User createUser(User user) {
        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword())); // Encode password
        return userRepo.save(newUser);
    }

    @Override
    public LoginResponse loginUser(User user) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername());

            // Get user details
            User loggedInUser = userRepo.findByEmail(user.getEmail());

            return new LoginResponse(token, loggedInUser.getEmail(), loggedInUser.getName());
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }
    }

    @Override
    public User findByUsername(String name) {
        return userRepo.findByName(name);
    }

    @Override
    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

}
