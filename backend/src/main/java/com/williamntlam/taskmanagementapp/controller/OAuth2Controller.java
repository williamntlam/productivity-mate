package com.williamntlam.taskmanagementapp.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class OAuth2Controller {
    
    /**
     * Handles OAuth2 callback from Google, processes tokens, and redirects users based on roles.
     *
     * @param authorizedClient the OAuth2 authorized client
     * @param oidcUser the authenticated user details
     * @param response the servlet response for redirection
     */

    @GetMapping("/oauth2/callback/google")
    public void handleOAuth2Callback(
        @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient,
        @AuthenticationPrincipal OidcUser oidcUser,
        HttpServletResponse response) throws IOException {

            // Extract tokens
            String accessToken = authorizedClient.getAccessToken().getTokenValue();
            String refreshToken = authorizedClient.getRefreshToken() != null
                ? authorizedClient.getRefreshToken().getTokenValue()
                : "No Refresh Token";

            // Extract user information
            String email = oidcUser.getEmail();
            String name = oidcUser.getFullName();

            // Log tokens and user information.
            System.out.println("Access Token: " + accessToken);
            System.out.println("Refresh Token: " + refreshToken);
            System.out.println("User Email: " + email);
            System.out.println("User Name: " + name);

            // Redirect based on role of the user.
            response.sendRedirect("/tasks");

        }
    

}
