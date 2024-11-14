package com.williamntlam.taskmanagementapp.service;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();

    }

    // Create User for registration
    public User registerUser(User user) {

        // Hash the password before saving the user.
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);

    }

    // Validate User Credentials
    public boolean validateUserCredentials(String username, String rawPassword) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return passwordEncoder.matches(rawPassword, user.getPassword());

    }

}
