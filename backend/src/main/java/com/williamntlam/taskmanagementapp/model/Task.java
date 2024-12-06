package com.williamntlam.taskmanagementapp.model;

import jakarta.persistence.*;
import java.util.Date;

import com.williamntlam.taskmanagementapp.utils.Enums.TaskPriority;
import com.williamntlam.taskmanagementapp.utils.Enums.TaskStatus;

@Entity
@Table(name = "Tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 300)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    @Temporal(TemporalType.DATE)
    private Date dueDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private Date creationDate;

    @Temporal(TemporalType.TIMESTAMP)
    @org.hibernate.annotations.UpdateTimestamp
    private Date updatedDate;

    public Task() {}

    public Task(String title, String description, TaskStatus status, TaskPriority priority, Date dueDate) {

        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;

    }

    public long getId() {

        return id;

    }

    public void setId(long id) {

        this.id = id;

    }

    public String getTitle() {

        return this.title;

    }

    public void setTitle(String title) {

        this.title = title;

    }

    public String getDescription() {

        return this.description;

    }

    public void setDescription(String description) {

        this.description = description;

    }

    public TaskStatus getStatus() {

        return this.status;

    }

    public void setStatus(TaskStatus status) {

        this.status = status;

    }

    public TaskPriority getPriority() {

        return this.priority;

    }

    public void setPriority(TaskPriority priority) {

        this.priority = priority;

    }

    public Date getDueDate() {

        return dueDate;

    }

    public void setDueDate(Date dueDate) {

        this.dueDate = dueDate;

    }

    public Date getCreationDate() {

        return this.creationDate;

    }

    public Date getUpdatedDate() {

        return this.updatedDate;

    }

}
