package com.williamntlam.taskmanagementapp;

import com.williamntlam.taskmanagementapp.utils.Db;
import java.sql.Connection;
import java.sql.SQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProductivityMate {

  private final Db db;

  @Autowired
  public ProductivityMate(Db db) {

    this.db = db;
  }

  public static void main(String[] args) {
    SpringApplication.run(ProductivityMate.class, args);
  }

  @Autowired
  public void initializeDatabase() {
    try (Connection connection = db.getConnection()) {
      System.out.println("Database connected: " + connection.getMetaData().getURL());
    } catch (SQLException e) {
      System.err.println("Failed to connect to the database.");
      e.printStackTrace();
    }
  }
}
