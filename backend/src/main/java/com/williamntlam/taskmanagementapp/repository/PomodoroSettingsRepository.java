package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PomodoroSettingsRepository extends JpaRepository<PomodoroSettings, Long>{
    
    Optional<PomodoroSettings> findByUserId(Long UserId);

}
