package com.williamntlam.taskmanagementapp.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.catalina.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.williamntlam.taskmanagementapp.utils.JwtUtils;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtils jwtUtils;

    public JwtAuthenticationFilter(JwtUtils jwtUtils) {

        this.jwtUtils = jwtUtils;

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // Extract Authorization Header
        String authHeader = request.getHeader("authorization");

        // Check if it contains a Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7); // Extract the token

            // Validate the token
            if (jwtUtils.validateToken(token)) {

                // Extract the username from the token
                String username = jwtUtils.extractUsername(token);

                // Create an authentification object and set it in the SecurityContext
                UsernamePasswordAuthenticationToken authentification = new UsernamePasswordAuthenticationToken(username, null, null);
                authentification.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentification);

            }

        }

        filterChain.doFilter(request, response);

    }

}
