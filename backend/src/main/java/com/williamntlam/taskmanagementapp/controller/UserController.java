package com.williamntlam.taskmanagementapp.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

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
      ResponseEntity<Map> responseEntity = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
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
}
