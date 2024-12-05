package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.repository.TaskRepository;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {

        this.taskRepository = taskRepository;

    }

    public Task createTask(Task task) {

        return taskRepository.save(task);

    }

    public Optional<Task> getTaskById(Long id) {

        return taskRepository.findById(id);

    }

    public List<Task> getAllTasks() {

        return taskRepository.findAll();

    }

    public List<Task> getTasksByStatus(TaskStatus status) {

        return taskRepository.findByStatus(status);

    }

    public List<Task> getTasksDueBefore(Date date) {

        return taskRepository.findByDueDateBefore(date);

    }

    public List<Task> getTasksDueAfter(Date date) {

        return taskRepository.findByDueDateAfter(date);

    }

    public List<Task> getTasksByPriorityAndStatus(TaskPriority priority, TaskStatus status) {

        return taskRepository.findByPriorityAndStatus(priority, status);

    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setPriority(updatedTask.getPriority());
            task.setStatus(updatedTask.getStatus());
            return taskRepository.save(task);
        }).orElseThrow(() -> new IllegalArgumentException("Task with ID " + id + " not found"));
    }

    public void deleteTask(Long id) {

        taskRepository.deleteById(id);

    }

}
