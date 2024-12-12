package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.Reminder;
import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.service.ReminderService;
import com.williamntlam.taskmanagementapp.service.UserService;
import java.util.Date;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

  private final ReminderService reminderService;
  private final UserService userService;

  public ReminderController(ReminderService reminderService, UserService userService) {

    this.reminderService = reminderService;
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<Reminder>> getAllReminders() {

    List<Reminder> reminders = reminderService.getAllReminders();
    return ResponseEntity.ok(reminders);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Reminder> getReminderById(@PathVariable Long id) {

    Reminder reminder = reminderService.getReminderById(id);
    if (reminder == null) {

      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(reminder);
  }

  @PostMapping
  public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {

    User user = userService.findById(reminder.getUserId());

    // Associate the user with the task
    reminder.setUser(user);

    // Save the task
    Reminder createdReminder = reminderService.saveReminder(reminder);

    return ResponseEntity.ok(createdReminder);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Reminder> updateReminder(
      @PathVariable Long id, @RequestBody Reminder updatedReminder) {
    Reminder existingReminder = reminderService.getReminderById(id);
    if (existingReminder == null) {
      return ResponseEntity.notFound().build();
    }
    Reminder savedReminder = reminderService.saveReminder(updatedReminder);
    return ResponseEntity.ok(savedReminder);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
    reminderService.deleteReminder(id);
    return ResponseEntity.noContent().build(); // Returns 204 No Content
  }

  @GetMapping("/status/{status}")
  public ResponseEntity<List<Reminder>> getRemindersByStatus(@PathVariable String status) {
    List<Reminder> reminders = reminderService.getRemindersByStatus(status);
    return ResponseEntity.ok(reminders);
  }

  @GetMapping("/overdue")
  public ResponseEntity<List<Reminder>> getOverdueReminders() {
    List<Reminder> overdueReminders = reminderService.getOverdueReminders(new Date());
    return ResponseEntity.ok(overdueReminders);
  }

  @GetMapping("/repeat-frequency/{days}")
  public ResponseEntity<List<Reminder>> getRemindersByRepeatFrequency(@PathVariable Integer days) {
    List<Reminder> reminders = reminderService.getRemindersByRepeatFrequency(days);
    return ResponseEntity.ok(reminders);
  }
}
