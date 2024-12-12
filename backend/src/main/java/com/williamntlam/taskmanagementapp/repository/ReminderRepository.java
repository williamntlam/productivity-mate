package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.Reminder;
import com.williamntlam.taskmanagementapp.utils.Enums.ReminderStatus;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

  List<Reminder> findByStatus(ReminderStatus status);

  List<Reminder> findByRepeatFrequencyDays(Integer repeatFrequencyDays);

  List<Reminder> findByReminderDateBefore(java.util.Date date);
}
