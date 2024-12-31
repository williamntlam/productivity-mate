package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.Reminder;
import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.service.ReminderService;
import com.williamntlam.taskmanagementapp.service.UserService;
import com.williamntlam.taskmanagementapp.utils.Enums.ReminderStatus;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

  private final ReminderService reminderService;
  private final UserService userService;

  public ReminderController(ReminderService reminderService, UserService userService) {

    this.reminderService = reminderService;
    this.userService = userService;
  }

  @PostMapping
public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder, HttpServletRequest request) {
    try {
        // Step 1: Extract and validate Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String accessToken = authHeader.substring(7);
        System.out.println("Access Token: " + accessToken);

        // Step 2: Call Google Userinfo API to fetch user email
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
        Map<String, Object> userInfo = responseEntity.getBody();

        if (userInfo == null || !responseEntity.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Extract email from the API response
        String emailFromApi = (String) userInfo.get("email");
        if (emailFromApi == null || emailFromApi.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Step 3: Fetch user details from the database
        Long userId = userService.findByEmail(emailFromApi)
            .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

        User user = userService.findById(userId);

        // Step 4: Associate the reminder with the user
        reminder.setUser(user);

        // Step 5: Save the reminder
        Reminder createdReminder = reminderService.saveReminder(reminder);

        // Step 6: Return the saved reminder
        return ResponseEntity.ok(createdReminder);

    } catch (Exception e) {
        e.printStackTrace(); // Log the full stack trace for debugging
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}


@PutMapping("/{id}")
public ResponseEntity<Reminder> updateReminder(
        @PathVariable Long id,
        @RequestBody Reminder updatedReminder,
        HttpServletRequest request) {
    try {
        // Step 1: Extract and validate Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String accessToken = authHeader.substring(7);

        // Step 2: Call Google Userinfo API to fetch user email
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
        Map<String, Object> userInfo = responseEntity.getBody();

        if (userInfo == null || !responseEntity.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract email from the API response
        String emailFromApi = (String) userInfo.get("email");
        if (emailFromApi == null || emailFromApi.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Step 3: Fetch user details from the database
        Long userId = userService.findByEmail(emailFromApi)
                .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

        // Step 4: Fetch the existing reminder from the database
        Optional<Reminder> optionalReminder = reminderService.getReminderById(id);
        if (optionalReminder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reminder existingReminder = optionalReminder.get();

        // Step 5: Validate ownership of the reminder
        if (!existingReminder.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Step 6: Retain the user from the existing reminder and update fields
        User user = existingReminder.getUser();
        updatedReminder.setUser(user);

        Reminder savedReminder = reminderService.updateReminder(updatedReminder);
        return ResponseEntity.ok(savedReminder);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
  

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteReminder(@PathVariable Long id, HttpServletRequest request) {
      try {
          // Step 1: Extract and validate Authorization header
          String authHeader = request.getHeader("Authorization");
          if (authHeader == null || !authHeader.startsWith("Bearer ")) {
              return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
          }

          String accessToken = authHeader.substring(7);
          System.out.println("Access Token: " + accessToken);

          // Step 2: Call Google Userinfo API to fetch user email
          String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
          RestTemplate restTemplate = new RestTemplate();

          HttpHeaders headers = new HttpHeaders();
          headers.set("Authorization", "Bearer " + accessToken);

          HttpEntity<String> entity = new HttpEntity<>(headers);

          ResponseEntity<Map> responseEntity = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
          Map<String, Object> userInfo = responseEntity.getBody();

          if (userInfo == null || !responseEntity.getStatusCode().is2xxSuccessful()) {
              return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
          }

          // Extract email from the API response
          String emailFromApi = (String) userInfo.get("email");
          if (emailFromApi == null || emailFromApi.isEmpty()) {
              return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
          }

          // Step 3: Fetch user details from the database
          Long userId = userService.findByEmail(emailFromApi)
              .orElseThrow(() -> new RuntimeException("No user found with the provided email"));

          // Step 4: Validate ownership of the reminder
          Reminder reminder = reminderService.getReminderById(id)
              .orElseThrow(() -> new RuntimeException("Reminder not found with ID: " + id));

          if (!reminder.getUser().getId().equals(userId)) {
              return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
          }

          // Step 5: Delete the reminder
          reminderService.deleteReminder(id);
          return ResponseEntity.noContent().build();

      } catch (Exception e) {
          e.printStackTrace(); // Log the full stack trace for debugging
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }


  @GetMapping("/status/{status}")
  public ResponseEntity<List<Reminder>> getRemindersByStatus(@PathVariable ReminderStatus status) {
    List<Reminder> reminders = reminderService.getRemindersByStatus(status);
    return ResponseEntity.ok(reminders);
  }

}
