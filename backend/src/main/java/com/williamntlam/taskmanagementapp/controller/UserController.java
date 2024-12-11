package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.utils.JwtUtils;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    // Check if email is already in use
    if (userService.emailExists(user.getEmail())) {
      Map<String, String> response = new HashMap<>();
      response.put("status", "error");
      response.put("message", "Email is already in use");
      return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // HTTP 409 Conflict
    }

    // Register the user
    userService.registerUser(user);
    String token = jwtUtils.generateToken(user.getEmail());

    // Response
    Map<String, String> response = new HashMap<>();
    response.put("status", "success");
    response.put("message", "User registered successfully");
    response.put("token", token);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {

    boolean isAuthenticated = userService.loginUser(user.getEmail(), user.getPassword());

    if (isAuthenticated) {

      String token = jwtUtils.generateToken(user.getEmail());
      Map<String, String> response = new HashMap<>();
      response.put("status", "success");
      response.put("message", "Login successful");
      response.put("token", token);

      return ResponseEntity.ok(response); // Returns as JSON
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(
            Map.of(
                "status", "error",
                "message", "Invalid credentials."));
  }
}
