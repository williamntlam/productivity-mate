package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PomodoroSettingsRepository extends JpaRepository<PomodoroSettings, Long> {

  Optional<PomodoroSettings> findByUserId(Long UserId);
}
