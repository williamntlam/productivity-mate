package com.williamntlam.taskmanagementapp.model;

import com.williamntlam.taskmanagementapp.utils.Enums.ReminderStatus;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Reminders")
public class Reminder {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, length = 300)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ReminderStatus status;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(nullable = false)
  private Date reminderDate;

  @Column(nullable = true)
  private Integer repeatFrequencyDays;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(nullable = false, updatable = false)
  @org.hibernate.annotations.CreationTimestamp
  private Date creationDate;

  @Temporal(TemporalType.TIMESTAMP)
  @org.hibernate.annotations.UpdateTimestamp
  private Date updatedDate;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  public Reminder() {}

  public Reminder(
      String title,
      String description,
      ReminderStatus status,
      Date reminderDate,
      Integer repeatFrequencyDays) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.reminderDate = reminderDate;
    this.repeatFrequencyDays = repeatFrequencyDays;
  }

  public long getId() {

    return this.id;
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

  public ReminderStatus getStatus() {

    return this.status;
  }

  public void setStatus(ReminderStatus status) {

    this.status = status;
  }

  public Date getReminderDate() {

    return this.reminderDate;
  }

  public void setReminderDate(Date reminderDate) {

    this.reminderDate = reminderDate;
  }

  public Integer getRepeatFrequencyDays() {

    return this.repeatFrequencyDays;
  }

  public void setRepeatFrequencyDays(Integer repeatFrequencyDays) {

    this.repeatFrequencyDays = repeatFrequencyDays;
  }

  public Date getCreationDate() {

    return this.creationDate;
  }

  public Date getUpdatedDate() {

    return this.updatedDate;
  }
}
