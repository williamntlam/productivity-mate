package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import com.williamntlam.taskmanagementapp.repository.PomodoroSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class PomodoroSettingsService {

  private final PomodoroSettingsRepository pomodoroSettingsRepository;

  public PomodoroSettingsService(PomodoroSettingsRepository pomodoroSettingsRepository) {

    this.pomodoroSettingsRepository = pomodoroSettingsRepository;
  }

  public PomodoroSettings getSettingsByUserId(Long userId) {

    return pomodoroSettingsRepository
        .findByUserId(userId)
        .orElseThrow(
            () -> new RuntimeException("No pomodoro settings found for User ID: " + userId));
  }

  public PomodoroSettings saveSettings(PomodoroSettings settings) {

    return pomodoroSettingsRepository.save(settings);
  }

  public void deleteSettings(Long id) {

    pomodoroSettingsRepository.deleteById(id);
  }

  public PomodoroSettings createDefaultSettings(Long userId) {

    PomodoroSettings defaulSettings = new PomodoroSettings();
    defaulSettings.setBreakDuration(45);
    defaulSettings.setBreakDuration(15);
    defaulSettings.setNotificationsEnabled(true);
    return pomodoroSettingsRepository.save(defaulSettings);
  }
}
