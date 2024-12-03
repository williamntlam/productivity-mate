package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

enum TaskPriority {
    LOW, MEDIUM, HIGH
}

enum TaskStatus {
    PENDING, IN_PROGRESS, COMPLETED
}

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBefore(Date date);
    List<Task> findByDueDateAfter(Date date);
    List<Task> findByPriorityAndStatus(TaskPriority priority, TaskStatus status);
    
}
