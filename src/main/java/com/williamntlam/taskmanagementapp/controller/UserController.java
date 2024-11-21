package com.williamntlam.taskmanagementapp.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.util.JwtUtils;
import com.williamntlam.taskmanagementapp.model.User;

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
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        userService.registerUser(user);
        String token = jwtUtils.generateToken(user.getUsername());
        return ResponseEntity.ok("Bearer " + token);

    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {

        boolean isAuthenticated = userService.loginUser(user.getUsername(), user.getPassword());

        if (isAuthenticated) {

            String token = jwtUtils.generateToken(user.getUsername());
            return ResponseEntity.ok("Bearer " + token);

        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");

    }

}
