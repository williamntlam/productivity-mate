package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.Reminder;
import com.williamntlam.taskmanagementapp.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;  
import java.util.Optional;

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

}
