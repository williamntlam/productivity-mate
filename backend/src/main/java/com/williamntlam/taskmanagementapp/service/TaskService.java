package com.williamntlam.taskmanagementapp.service;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.model.User;
import com.williamntlam.taskmanagementapp.repository.TaskRepository;
import com.williamntlam.taskmanagementapp.repository.UserRepository;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

  private final TaskRepository taskRepository;
  private final UserRepository userRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

  public Task createTask(Task task) {

    return taskRepository.save(task);
  }

  public Optional<Task> getTaskById(Long id) {

    return taskRepository.findById(id);
  }

  public Page<Task> getAllTasks(Pageable pagetable) {

    return taskRepository.findAll(pagetable);
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
    return taskRepository
        .findById(id)
        .map(
            task -> {
              task.setTitle(updatedTask.getTitle());
              task.setDescription(updatedTask.getDescription());
              task.setDueDate(updatedTask.getDueDate());
              task.setPriority(updatedTask.getPriority());
              task.setStatus(updatedTask.getStatus());
              return taskRepository.save(task);
            })
        .orElseThrow(() -> new IllegalArgumentException("Task with ID " + id + " not found"));
  }

  public void deleteTask(Long id) {

    taskRepository.deleteById(id);
  }

  public List<Task> getTasksByUserId(Long userId) {
    // Fetch the User entity by ID
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    // Use the User entity to fetch tasks
    return taskRepository.findByUser(user);
}


}
