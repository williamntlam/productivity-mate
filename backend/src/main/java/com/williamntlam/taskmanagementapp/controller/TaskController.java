package com.williamntlam.taskmanagementapp.controller;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.service.TaskService;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;
import jakarta.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {

  private final TaskService taskService;

  @Autowired
  public TaskController(TaskService taskService) {

    this.taskService = taskService;
  }

  @PostMapping
  public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {

    Task createdTask = taskService.createTask(task);
    return ResponseEntity.ok(createdTask);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> getTaskById(@PathVariable Long id) {

    Optional<Task> task = taskService.getTaskById(id);
    return task.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<Page<Task>> getAllTasks(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<Task> tasks = taskService.getAllTasks(pageable);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("/status/{status}")
  public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status) {

    List<Task> tasks = taskService.getTasksByStatus(status);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("due-before")
  public ResponseEntity<List<Task>> getTasksDueBefore(@RequestParam("date") Date date) {

    List<Task> tasks = taskService.getTasksDueBefore(date);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("due-after")
  public ResponseEntity<List<Task>> getTasksDueAfter(@RequestParam("date") Date date) {

    List<Task> tasks = taskService.getTasksDueAfter(date);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("priority-and-status")
  public ResponseEntity<List<Task>> getTasksByPriorityAndStatus(
      @RequestParam("priority") TaskPriority priority, @RequestParam("status") TaskStatus status) {

    List<Task> tasks = taskService.getTasksByPriorityAndStatus(priority, status);
    return ResponseEntity.ok(tasks);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Task> updateTask(
      @PathVariable Long id, @Valid @RequestBody Task updatedTask) {
    try {
      Task task = taskService.updateTask(id, updatedTask);
      return ResponseEntity.ok(task);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
    try {
      taskService.deleteTask(id);
      return ResponseEntity.noContent().build();
    } catch (EmptyResultDataAccessException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
