package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.Reminder;
import com.williamntlam.taskmanagementapp.repository.ReminderRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ReminderService {

  private final ReminderRepository reminderRepository;

  public ReminderService(ReminderRepository reminderRepository) {

    this.reminderRepository = reminderRepository;
  }

  public List<Reminder> getAllReminders() {

    return reminderRepository.findAll();
  }

  public Reminder getReminderById(Long id) {

    Optional<Reminder> reminder = reminderRepository.findById(id);
    return reminder.orElse(null);
  }

  public Reminder saveReminder(Reminder reminder) {

    return reminderRepository.save(reminder);
  }

  public void deleteReminder(Long id) {

    if (reminderRepository.existsById(id)) {

      reminderRepository.deleteById(id);

    } else {

      throw new IllegalArgumentException("Reminder with ID " + id + " does not exist.");
    }
  }

  public List<Reminder> getRemindersByStatus(String status) {

    return reminderRepository.findByStatus(status);
  }

  public List<Reminder> getOverdueReminders(Date currentDate) {

    return reminderRepository.findByReminderDateBefore(currentDate);
  }

  public List<Reminder> getRemindersByRepeatFrequency(Integer repeatFrequencyDays) {

    return reminderRepository.findByRepeatFrequencyDays(repeatFrequencyDays);
  }

  public void updateNextReminderDay(Reminder reminder) {

    if (reminder.getRepeatFrequencyDays() != null) {

      Date currentReminderDate = reminder.getReminderDate();
      Integer repeatFrequencyDays = reminder.getRepeatFrequencyDays();

      Date nextReminderDate = calculateNextReminderDate(currentReminderDate, repeatFrequencyDays);

      reminder.setReminderDate(nextReminderDate);
      reminderRepository.save(reminder);
    }
  }

  private Date calculateNextReminderDate(Date currentReminderDate, int repeatFrequencyDays) {

    java.util.Calendar calendar = java.util.Calendar.getInstance();
    calendar.setTime(currentReminderDate);
    calendar.add(java.util.Calendar.DAY_OF_YEAR, repeatFrequencyDays);
    return calendar.getTime();
  }
}
