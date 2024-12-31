package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.service.TaskService;
import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private final TaskService taskService;
  private final UserService userService;

  @Autowired
  public TaskController(TaskService taskService, UserService userService) {

    this.taskService = taskService;
    this.userService = userService;
  }

  @PostMapping
  public ResponseEntity<Task> createTask(
      @Valid @RequestBody Task task, HttpServletRequest request) {
    // Extract Authorization header
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new RuntimeException("Missing or invalid Authorization header");
    }

    String accessToken = authHeader.substring(7); // Extract the token
    System.out.println("Access Token: " + accessToken);

    // Call Google Userinfo API
    String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    RestTemplate restTemplate = new RestTemplate();

    // Set up headers for the request
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    try {
      // Call the Userinfo API
      ResponseEntity<Map> responseEntity =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
      Map<String, Object> userInfo = responseEntity.getBody();

      if (userInfo == null) {
        throw new RuntimeException("Userinfo API returned null");
      }

      // Extract the user's email from the API response
      String emailFromApi = (String) userInfo.get("email");

      // Fetch the user ID from the database based on the email
      Long userId =
          userService
              .findByEmail(emailFromApi)
              .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

      // Fetch the User object using the user ID
      User user = userService.findById(userId);

      // Associate the user with the task
      task.setUser(user);

      // Save the task
      Task createdTask = taskService.createTask(task);

      return ResponseEntity.ok(createdTask);

    } catch (Exception e) {
      e.printStackTrace(); // Log the full stack trace for debugging
      throw new RuntimeException("Error validating user with Google Userinfo API", e);
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> getTaskById(@PathVariable Long id) {

    Optional<Task> task = taskService.getTaskById(id);
    return task.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<Page<Task>> getAllTasks(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<Task> tasks = taskService.getAllTasks(pageable);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("/status/{status}")
  public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {

    List<Task> tasks = taskService.getTasksByStatus(status);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("due-before")
  public ResponseEntity<List<Task>> getTasksDueBefore(
      @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {

    List<Task> tasks = taskService.getTasksDueBefore(date);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("due-after")
  public ResponseEntity<List<Task>> getTasksDueAfter(
      @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {

    List<Task> tasks = taskService.getTasksDueAfter(date);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("priority-and-status")
  public ResponseEntity<List<Task>> getTasksByPriorityAndStatus(
      @RequestParam("priority") TaskPriority priority, @RequestParam("status") TaskStatus status) {

    List<Task> tasks = taskService.getTasksByPriorityAndStatus(priority, status);
    return ResponseEntity.ok(tasks);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Task> updateTask(
      @PathVariable Long id, @Valid @RequestBody Task updatedTask, HttpServletRequest request) {
    try {
      // Step 1: Extract and validate Authorization header
      String authHeader = request.getHeader("Authorization");
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Missing or invalid Authorization header");
      }

      String accessToken = authHeader.substring(7); // Extract token
      System.out.println("Access Token: " + accessToken);

      // Step 2: Call Google Userinfo API to fetch user email
      String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
      RestTemplate restTemplate = new RestTemplate();

      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + accessToken);

      HttpEntity<String> entity = new HttpEntity<>(headers);

      ResponseEntity<Map> responseEntity =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
      Map<String, Object> userInfo = responseEntity.getBody();

      if (userInfo == null) {
        throw new RuntimeException("Userinfo API returned null");
      }

      String emailFromApi = (String) userInfo.get("email");
      System.out.println("Email from Google API: " + emailFromApi);

      // Step 3: Find user by email in the local database
      Optional<Long> userIdOptional = userService.findByEmail(emailFromApi);

      if (userIdOptional.isEmpty()) {
        throw new RuntimeException("No user found with the provided email");
      }

      Long userId = userIdOptional.get();

      Optional<Task> optionalTask = taskService.getTaskById(id); // Returns Optional<Task>
      if (optionalTask.isEmpty()) {
        return ResponseEntity.notFound().build();
      }

      Task existingTask = optionalTask.get();

      if (!existingTask.getUser().getId().equals(userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }

      // Step 5: Update the task
      Task task = taskService.updateTask(id, updatedTask);
      return ResponseEntity.ok(task);

    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(null); // Or handle specific exceptions
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id, HttpServletRequest request) {
    try {
      // Step 1: Extract and validate Authorization header
      String authHeader = request.getHeader("Authorization");
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Missing or invalid Authorization header");
      }

      String accessToken = authHeader.substring(7); // Extract token
      System.out.println("Access Token: " + accessToken);

      // Step 2: Call Google Userinfo API to fetch user email
      String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
      RestTemplate restTemplate = new RestTemplate();

      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + accessToken);

      HttpEntity<String> entity = new HttpEntity<>(headers);

      ResponseEntity<Map> responseEntity =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

      Map<String, Object> userInfo = responseEntity.getBody();
      if (userInfo == null) {
        throw new RuntimeException("Userinfo API returned null");
      }

      String emailFromApi = (String) userInfo.get("email");
      System.out.println("Email from Google API: " + emailFromApi);

      // Step 3: Find user by email in the local database
      Long userId =
          userService
              .findByEmail(emailFromApi)
              .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

      // Step 4: Find the task by ID
      Task existingTask =
          taskService
              .getTaskById(id)
              .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));

      // Step 5: Validate task ownership
      if (!existingTask.getUser().getId().equals(userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }

      // Step 6: Delete the task
      taskService.deleteTask(id);
      return ResponseEntity.noContent().build();

    } catch (RuntimeException e) {
      System.err.println("Error: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
