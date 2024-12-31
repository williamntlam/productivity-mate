package com.williamntlam.taskmanagementapp.utils;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.williamntlam.taskmanagementapp.service.UserService;

import com.williamntlam.taskmanagementapp.model.User;

public final class HelperUtils {

    private HelperUtils() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static User validateUser(String authorizationHeader, UserService userService) {
        // Step 1: Extract and validate Authorization header
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String accessToken = authorizationHeader.substring(7); // Extract token
        System.out.println("Access Token: " + accessToken);

        // Step 2: Call Google Userinfo API to fetch user email
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity =
            restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

        Map<String, Object> userInfo = responseEntity.getBody();
        if (userInfo == null) {
            throw new RuntimeException("Userinfo API returned null");
        }

        String emailFromApi = (String) userInfo.get("email");
        System.out.println("Email from Google API: " + emailFromApi);

        // Step 3: Find user by email in the local database
        Long userId = userService
            .findByEmail(emailFromApi)
            .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

        return userService.findById(userId); // Return the full User object
    }
}
