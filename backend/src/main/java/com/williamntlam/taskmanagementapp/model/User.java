package com.williamntlam.taskmanagementapp.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name = "Users") // Rename the table to 'users'
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private PomodoroSettings pomodoroSettings;

  private String username;
  private String password;

  public Long getId() {

    return id;
  }

  public void setId(Long id) {

    this.id = id;
  }

  public String getUsername() {

    return username;
  }

  public void setUsername(String username) {

    this.username = username;
  }

  public String getPassword() {

    return password;
  }

  public void setPassword(String password) {

    this.password = password;
  }
}
