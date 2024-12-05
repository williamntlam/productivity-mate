package com.williamntlam.taskmanagementapp.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRATION_DATE = 86400000;

    public String generateToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_DATE))
                .signWith(key)
                .compact();

    }

    public boolean validateToken(String token) {

        try {

            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJwt(token);
            return true;

        } catch (Exception exception) {

            return false;

        }

    }

    public String extractUsername(String token) {

        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJwt(token)
                .getBody()
                .getSubject();

    }

}
