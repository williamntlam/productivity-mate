package com.williamntlam.taskmanagementapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pomodoro_settings")
public class PomodoroSettings {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private int workDuration;
    private int breakDuration;
    private boolean notificationsEnabled;

    public Long getId() {

        return this.id;

    }

    public void setId(Long id) {

        this.id = id;

    }

    public User getUser() {

        return this.user;

    }

    public void setUser(User user) {

        this.user = user;

    }

    public int getWorkDuration() {

        return this.workDuration;

    }

    public void setWorkDuration(int workDuration) {

        this.workDuration = workDuration;

    }

    public int getBreakDuration() {

        return this.breakDuration;

    }

    public void setBreakDuration(int breakDuration) {

        this.breakDuration = breakDuration;

    }

    public boolean isNotificationsEnabled() {

        return this.notificationsEnabled;

    }

    public void setNotificationsEnabled(boolean notificationsEnabled) {

        this.notificationsEnabled = notificationsEnabled;

    }

}
