package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
