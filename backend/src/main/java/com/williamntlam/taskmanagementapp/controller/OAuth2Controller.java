package com.williamntlam.taskmanagementapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class OAuth2Controller {

    @GetMapping("/api/oauth2/callback/google")
public ResponseEntity<?> handleOAuth2Callback(
        @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient,
        @AuthenticationPrincipal OidcUser oidcUser) {

    // Extract tokens
    String accessToken = authorizedClient.getAccessToken().getTokenValue();
    String refreshToken = authorizedClient.getRefreshToken() != null
            ? authorizedClient.getRefreshToken().getTokenValue()
            : null;

    // Extract user information
    String email = oidcUser.getEmail();
    String name = oidcUser.getFullName();

    // Build the response
    Map<String, Object> response = new HashMap<>();
    response.put("accessToken", accessToken);
    response.put("refreshToken", refreshToken);
    response.put("email", email);
    response.put("name", name);

    return ResponseEntity.ok(response);
}

}
