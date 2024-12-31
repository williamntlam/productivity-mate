package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.service.TaskService;
import com.williamntlam.taskmanagementapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;
  private final TaskService taskService;

  @Autowired
  public UserController(UserService userService, TaskService taskService) {
    this.userService = userService;
    this.taskService = taskService;
  }

  @GetMapping("/tasks")
  public ResponseEntity<List<Task>> getTasksByAuthenticatedUser(
      @RequestHeader("Authorization") String authHeader) {
    // Step 1: Validate the Authorization header
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String accessToken = authHeader.substring(7); // Extract the token

    try {
      // Step 2: Call Google API to get the user's email
      String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
      RestTemplate restTemplate = new RestTemplate();
      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + accessToken);

      HttpEntity<String> entity = new HttpEntity<>(headers);
      ResponseEntity<Map> response =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

      if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      // Extract the email from the Google API response
      String email = (String) response.getBody().get("email");
      if (email == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      // Step 3: Find the user ID in the database using the email
      Optional<Long> optionalUserId = userService.findByEmail(email);
      if (optionalUserId.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      Long userId = optionalUserId.get();

      // Step 4: Fetch tasks for the user by their ID
      List<Task> tasks = taskService.getTasksByUserId(userId);
      return ResponseEntity.ok(tasks);

    } catch (Exception e) {
      // Log the exception and return a 401 Unauthorized status
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  @GetMapping("/info")
  public Map<String, Object> getUserInfo(HttpServletRequest request) {
    // Extract Authorization header
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new RuntimeException("Missing or invalid Authorization header");
    }

    String accessToken = authHeader.substring(7); // Extract token
    System.out.println("Access Token: " + accessToken);

    // Call Google Userinfo API
    String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    RestTemplate restTemplate = new RestTemplate();

    // Create headers with the Authorization token
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    try {
      // Call the Userinfo API
      ResponseEntity<Map> responseEntity =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
      Map<String, Object> userInfo = responseEntity.getBody();

      if (userInfo == null) {
        throw new RuntimeException("Userinfo API returned null");
      }

      // Extract user info from the response
      String email = (String) userInfo.get("email");
      String name = (String) userInfo.get("name");
      String firstName = (String) userInfo.get("given_name");
      String lastName = (String) userInfo.get("family_name");
      String picture = (String) userInfo.get("picture");
      Boolean emailVerified = (Boolean) userInfo.get("email_verified");

      // Return the user info as a response
      Map<String, Object> response = new HashMap<>();
      response.put("status", "success");
      response.put("email", email);
      response.put("name", name);
      response.put("firstName", firstName);
      response.put("lastName", lastName);
      response.put("picture", picture);
      response.put("emailVerified", emailVerified);

      return response;

    } catch (Exception e) {
      e.printStackTrace(); // Log the full stack trace for debugging
      throw new RuntimeException("Error fetching user info from Google Userinfo API", e);
    }
  }

  @GetMapping("/id")
  public Map<String, Object> getUserIdByEmail(HttpServletRequest request) {
    // Extract Authorization header
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new RuntimeException("Missing or invalid Authorization header");
    }

    String accessToken = authHeader.substring(7); // Extract token
    System.out.println("Access Token: " + accessToken);

    // Call Google Userinfo API
    String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    RestTemplate restTemplate = new RestTemplate();

    // Create headers with the Authorization token
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    try {
      // Call the Userinfo API
      ResponseEntity<Map> responseEntity =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
      Map<String, Object> userInfo = responseEntity.getBody();

      if (userInfo == null) {
        throw new RuntimeException("Userinfo API returned null");
      }

      // Extract user info from the response
      String emailFromApi = (String) userInfo.get("email");

      Optional<Long> userId = userService.findByEmail(emailFromApi);

      if (userId.isEmpty()) {
        throw new RuntimeException("No user found with the provided email");
      }
      // Return the user's ID as a response
      Map<String, Object> response = new HashMap<>();
      response.put("status", "success");
      response.put("userId", userId.get());

      return response;

    } catch (Exception e) {
      e.printStackTrace(); // Log the full stack trace for debugging
      throw new RuntimeException("Error fetching user ID", e);
    }
  }
}
