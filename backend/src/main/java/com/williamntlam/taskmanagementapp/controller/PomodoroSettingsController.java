package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.service.PomodoroSettingsService;
import com.williamntlam.taskmanagementapp.service.UserService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pomodoro-settings")
public class PomodoroSettingsController {

  private final PomodoroSettingsService pomodoroSettingsService;
  private final UserService userService;

  public PomodoroSettingsController(
      PomodoroSettingsService pomodoroSettingsService, UserService userService) {

    this.pomodoroSettingsService = pomodoroSettingsService;
    this.userService = userService;
  }

  @GetMapping("/{id}")
  public ResponseEntity<PomodoroSettings> getSettings(@PathVariable Long id) {

    PomodoroSettings settings = pomodoroSettingsService.getSettingsById(id);
    return ResponseEntity.ok(settings);
  }

  @PostMapping
  public ResponseEntity<PomodoroSettings> saveSettings(@RequestBody PomodoroSettings settings) {
    // Validate the user association
    User user = settings.getUser();
    if (user == null || user.getId() == null) {
      return ResponseEntity.badRequest().body(null); // User ID must be provided
    }

    // Verify the user exists in the database
    User existingUser = userService.findById(user.getId());
    if (existingUser == null) {
      return ResponseEntity.badRequest().body(null); // User not found
    }

    // Set the existing user to the settings
    settings.setUser(existingUser);

    // Save the pomodoro settings
    PomodoroSettings savedSettings = pomodoroSettingsService.saveSettings(settings);

    // Return the saved settings
    return ResponseEntity.ok(savedSettings);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSettings(@PathVariable Long id) {
    try {
      pomodoroSettingsService.deleteSettings(id);
      return ResponseEntity.noContent().build(); // 204 No Content on success
    } catch (EmptyResultDataAccessException e) {
      return ResponseEntity.notFound().build(); // 404 Not Found if the ID does not exist
    }
  }
}
