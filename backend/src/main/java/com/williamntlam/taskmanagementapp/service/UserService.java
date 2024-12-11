package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository) {

    this.userRepository = userRepository;
    this.passwordEncoder = new BCryptPasswordEncoder();
  }
  
  public User findById(Long userId) {
    return userRepository.findById(userId)
                         .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
}


  // Create User for registration
  public User registerUser(User user) {

    // Hash the password before saving the user.
    String hashedPassword = passwordEncoder.encode(user.getPassword());
    user.setPassword(hashedPassword);

    return userRepository.save(user);
  }

  // Validate User Credentials
  public boolean loginUser(String username, String rawPassword) {

    User user =
        userRepository
            .findByEmail(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    return passwordEncoder.matches(rawPassword, user.getPassword());
  }

  public boolean emailExists(String email) {
    return userRepository.findByEmail(email).isPresent();
  }

}
