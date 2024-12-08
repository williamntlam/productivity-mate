package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import com.williamntlam.taskmanagementapp.service.PomodoroSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pomodoro-settings")
public class PomodoroSettingsController {

  private final PomodoroSettingsService pomodoroSettingsService;

  public PomodoroSettingsController(PomodoroSettingsService pomodoroSettingsService) {

    this.pomodoroSettingsService = pomodoroSettingsService;
  }

  @GetMapping("/{userId}")
  public ResponseEntity<PomodoroSettings> getSettings(@PathVariable Long userId) {

    PomodoroSettings settings = pomodoroSettingsService.getSettingsByUserId(userId);
    return ResponseEntity.ok(settings);
  }

  public ResponseEntity<PomodoroSettings> saveSettings(@RequestBody PomodoroSettings settings) {

    PomodoroSettings savedSettings = pomodoroSettingsService.saveSettings(settings);
    return ResponseEntity.ok(savedSettings);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteSettings(@PathVariable Long id) {

    pomodoroSettingsService.deleteSettings(id);
    return ResponseEntity.ok("Pomodoro settings deleted successfully.");
  }
}
