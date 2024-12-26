package com.williamntlam.taskmanagementapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.ignoringRequestMatchers("/public/**", "/oauth2/**"))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/oauth2/**", "/api/users/info")
            .permitAll()
            .anyRequest()
            .authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .successHandler((request, response, authentication) -> {
              // Handle success without redirecting
              response.setStatus(HttpServletResponse.SC_OK);
              response.getWriter().write("{\"message\": \"Login successful\"}");
              response.getWriter().flush();
            })
        );

    return http.build();
  }
}

