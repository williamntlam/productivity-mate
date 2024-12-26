package com.williamntlam.taskmanagementapp.controller;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

@Controller
public class OAuth2Controller {

    @PostMapping("/api/oauth2/callback/google")
    public ResponseEntity<?> handleOAuth2Callback(
            @RequestBody Map<String, String> requestBody, HttpServletResponse response) throws IOException {

        // Extract the authorization code from the request body
        String authorizationCode = requestBody.get("code");
        if (authorizationCode == null || authorizationCode.isEmpty()) {
            return ResponseEntity.badRequest().body("Authorization code is missing");
        }

        // Exchange authorization code for tokens
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", authorizationCode);
        params.add("client_id", System.getenv("GOOGLE_CLIENT_ID"));
        params.add("client_secret", System.getenv("GOOGLE_CLIENT_SECRET"));
        params.add("redirect_uri", System.getenv("GOOGLE_REDIRECT_URI"));
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map<String, Object>> tokenResponse =
                restTemplate.exchange("https://oauth2.googleapis.com/token", HttpMethod.POST, request, 
                                       new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});

        if (tokenResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(tokenResponse.getStatusCode()).body("Token exchange failed");
        }

        // Extract tokens
        Map<String, Object> tokenData = tokenResponse.getBody();
        String accessToken = (String) tokenData.get("access_token");
        String refreshToken = (String) tokenData.getOrDefault("refresh_token", "No Refresh Token");

        // Use access token to fetch user information
        headers.clear();
        headers.add("Authorization", "Bearer " + accessToken);
        HttpEntity<String> userInfoRequest = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> userInfoResponse =
                restTemplate.exchange("https://openidconnect.googleapis.com/v1/userinfo", HttpMethod.GET, 
                                       userInfoRequest, new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});

        if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userInfoResponse.getStatusCode()).body("User info retrieval failed");
        }

        Map<String, Object> userInfo = userInfoResponse.getBody();
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        // Log tokens and user information
        System.out.println("Access Token: " + accessToken);
        System.out.println("Refresh Token: " + refreshToken);
        System.out.println("User Email: " + email);
        System.out.println("User Name: " + name);

        // Redirect or respond based on application logic
        response.sendRedirect("/tasks");
        return ResponseEntity.ok().build();
    }
}
