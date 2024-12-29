package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  /**
   * Endpoint to retrieve authenticated user info after OAuth login.
   *
   * @param oidcUser Authenticated user's OpenID Connect details.
   * @param authorizedClient OAuth2 authorized client with access and refresh tokens.
   * @return A response containing user details and OAuth tokens.
   */
  @GetMapping("/info")
  public Map<String, Object> getUserInfo(
      @AuthenticationPrincipal OidcUser oidcUser,
      @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient) {

    // Extract user details from OIDC
    String email = oidcUser.getEmail();
    String name = oidcUser.getFullName();
    String picture = oidcUser.getPicture();

    // Create a response with user details and OAuth tokens
    Map<String, Object> response = new HashMap<>();
    response.put("status", "success");
    response.put("email", email);
    response.put("name", name);
    response.put("picture", picture);
    response.put("accessToken", authorizedClient.getAccessToken().getTokenValue());
    response.put(
        "refreshToken",
        authorizedClient.getRefreshToken() != null
            ? authorizedClient.getRefreshToken().getTokenValue()
            : null);

    return response;
  }

  /**
   * Logout endpoint to clear the user's session and redirect to a logout page.
   *
   * @param response The HTTP response for redirection.
   */
  @GetMapping("/logout")
  public void logout(HttpServletResponse response) throws IOException {
    // Clear user session (if using session-based authentication)
    response.sendRedirect("/logout-success"); // Redirect to a logout success page
  }
}
