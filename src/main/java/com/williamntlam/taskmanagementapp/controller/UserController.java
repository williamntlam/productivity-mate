package com.williamntlam.taskmanagementapp.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;

    }

    public ResponseEntity<String> registerUser(@RequestBody User user) {

        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully.");

    }

    public ResponseEntity<String> loginUser(@RequestBody User user) {

        boolean isAuthenticated = userService.loginUser(user.getUsername(), user.getPassword());

        // if (isAuthenticated) {

        //     return ResponseEntity.ok("Login successful.");

        // }

        // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");

        return isAuthenticated ? ResponseEntity.ok("Login successful.") : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");

    }

}
