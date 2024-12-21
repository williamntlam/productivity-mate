package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import com.williamntlam.taskmanagementapp.repository.PomodoroSettingsRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

@Service
public class PomodoroSettingsService {

  private final PomodoroSettingsRepository pomodoroSettingsRepository;

  public PomodoroSettingsService(PomodoroSettingsRepository pomodoroSettingsRepository) {

    this.pomodoroSettingsRepository = pomodoroSettingsRepository;
  }

  public PomodoroSettings getSettingsById(Long id) {

    return pomodoroSettingsRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("No pomodoro settings found with id: " + id));
  }

  public PomodoroSettings saveSettings(PomodoroSettings settings) {

    return pomodoroSettingsRepository.save(settings);
  }


  public void deleteSettings(Long id) {
    try {
      pomodoroSettingsRepository.deleteByIdCustom(id);
    } catch (EmptyResultDataAccessException e) {
      throw new IllegalArgumentException("Pomodoro settings with ID " + id + " do not exist.", e);
    }
  }

  public PomodoroSettings createDefaultSettings(Long userId) {

    PomodoroSettings defaulSettings = new PomodoroSettings();
    defaulSettings.setBreakDuration(45);
    defaulSettings.setBreakDuration(15);
    defaulSettings.setNotificationsEnabled(true);
    return pomodoroSettingsRepository.save(defaulSettings);
  }
}
