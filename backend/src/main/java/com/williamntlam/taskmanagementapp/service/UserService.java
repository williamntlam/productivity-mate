package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {

    this.userRepository = userRepository;
  }

  public User findById(Long userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
  }

  // Create User for registration
  public User registerUser(User user) {
    return userRepository.save(user);
  }

  public boolean emailExists(String email) {
    return userRepository.findByEmail(email).isPresent();
  }

  public Optional<Long> findByEmail(String email) {
    Optional<User> user = userRepository.findByEmail(email);
    return user.map(User::getId);
  }
}
