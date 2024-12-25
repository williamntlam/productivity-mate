package com.williamntlam.taskmanagementapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CSRF protection by default
            .csrf(csrf -> csrf.ignoringRequestMatchers("/public/**", "/oauth2/**")) // Exclude specific endpoints if needed
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth2/**").permitAll() // Public endpoints
                .anyRequest().authenticated() // Protect all other endpoints
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/callback", true) // Redirect to /callback after login
            );

        return http.build();
    }
}
