package com.williamntlam.taskmanagementapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.williamntlam.taskmanagementapp.service.UserService;

import com.williamntlam.taskmanagementapp.model.User;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth2/callback")
public class OAuth2CallbackController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String userInfoUri;

    private UserService userService; 

    public OAuth2CallbackController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/google")
    public ResponseEntity<?> handleOAuth2Callback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authorization code is missing"));
        }

        // Exchange the authorization code for tokens
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", clientId); // Pulled from application.properties
        params.put("client_secret", clientSecret); // Pulled from application.properties
        params.put("redirect_uri", redirectUri); // Pulled from application.properties
        params.put("grant_type", "authorization_code");

        try {
            // Make POST request to exchange the code for tokens
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(params);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                tokenUri, HttpMethod.POST, requestEntity, (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> tokens = response.getBody();

                // Extract access and refresh tokens
                String accessToken = (String) tokens.get("access_token");
                String refreshToken = tokens.containsKey("refresh_token")
                        ? (String) tokens.get("refresh_token")
                        : null;

                // Fetch user information using the access token
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + accessToken);
                HttpEntity<Void> userInfoRequest = new HttpEntity<>(headers);

                ResponseEntity<Map<String, Object>> userInfoResponse = restTemplate.exchange(
                    userInfoUri, HttpMethod.GET, userInfoRequest, (Class<Map<String, Object>>) (Class<?>) Map.class
                );

                if (userInfoResponse.getStatusCode().is2xxSuccessful()) {
                    Map<String, Object> userInfo = userInfoResponse.getBody();

                    // Build the response to the frontend
                    Map<String, Object> result = new HashMap<>();
                    result.put("accessToken", accessToken);
                    result.put("refreshToken", refreshToken);
                    result.put("userInfo", userInfo);

                    // Extract email and name from userInfo
                    String email = (String) userInfo.get("email"); 
                    String firstName = (String) userInfo.get("given_name"); 
                    String lastName = (String) userInfo.get("family_name");


                    // Check if the user exists in the database; if not, register them
                    if (!userService.emailExists(email)) {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setFirstName(firstName);
                        newUser.setLastName(lastName);
                        userService.registerUser(newUser); // Save user to database
                    }

                    return ResponseEntity.ok(result);
                } else {
                    return ResponseEntity.status(userInfoResponse.getStatusCode())
                            .body(Map.of("error", "Failed to fetch user information"));
                }
            } else {
                return ResponseEntity
                        .status(response.getStatusCode())
                        .body(response.getBody());
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred while processing the request", "details", e.getMessage()));
        }
    }
}
