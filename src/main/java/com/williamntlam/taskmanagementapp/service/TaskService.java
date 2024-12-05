package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
enum TaskPriority {
    LOW, MEDIUM, HIGH
}

enum TaskStatus {
    PENDING, IN_PROGRESS, COMPLETED
}


public class TaskService {
    
}
