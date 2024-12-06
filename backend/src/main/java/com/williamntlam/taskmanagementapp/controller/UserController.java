package com.williamntlam.taskmanagementapp.controller;

import java.util.HashMap;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.utils.JwtUtils;
import com.williamntlam.taskmanagementapp.model.User;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {

        this.userService = userService;
        this.jwtUtils = jwtUtils;

    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {

        userService.registerUser(user);
        String token = jwtUtils.generateToken(user.getUsername());
        
        // Wrap the response in a Map (or use a custom DTO)
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "User registered successfully");
        response.put("token", token);

        return ResponseEntity.ok(response); // Returns as JSON

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {

        boolean isAuthenticated = userService.loginUser(user.getUsername(), user.getPassword());

        if (isAuthenticated) {

            String token = jwtUtils.generateToken(user.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("token", token);

            return ResponseEntity.ok(response); // Returns as JSON

        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            Map.of(
                "status", "error",
                "message", "Invalid credentials."
            )
        );
        
    }

}
