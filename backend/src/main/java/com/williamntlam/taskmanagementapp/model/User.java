package com.williamntlam.taskmanagementapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Users") // Rename the table to 'users'
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private PomodoroSettings pomodoroSettings;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  public Long getId() {

    return id;
  }

  public void setId(Long id) {

    this.id = id;
  }

  public String getEmail() {

    return email;
  }

  public void setEmail(String email) {

    this.email = email;
  }

  public String getFirstName() {

    return firstName;
  }

  public void setFirstName(String name) {

    this.firstName = name;
  }

  public String getLastName() {

    return lastName;
  }

  public void setLastName(String name) {

    this.lastName = name;
  }
}
