package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.Task;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

  List<Task> findByStatus(TaskStatus status);

  List<Task> findByDueDateBefore(Date date);

  List<Task> findByDueDateAfter(Date date);

  List<Task> findByPriorityAndStatus(TaskPriority priority, TaskStatus status);

  Page<Task> findAll(Pageable pageable);
}
