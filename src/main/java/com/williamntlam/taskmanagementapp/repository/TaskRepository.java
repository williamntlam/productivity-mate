package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBefore(Date date);
    List<Task> findByDueDateAfter(Date date);
    List<Task> findByPriorityAndStatus(TaskPriority priority, TaskStatus status);
    
}
