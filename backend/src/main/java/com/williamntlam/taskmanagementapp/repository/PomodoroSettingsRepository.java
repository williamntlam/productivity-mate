package com.williamntlam.taskmanagementapp.repository;

import com.williamntlam.taskmanagementapp.model.PomodoroSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PomodoroSettingsRepository extends JpaRepository<PomodoroSettings, Long> {

  Optional<PomodoroSettings> findByUserId(Long UserId);
  
  @Transactional
  @Modifying
  @Query("DELETE FROM PomodoroSettings ps WHERE ps.id = :id")
  void deleteByIdCustom(@Param("id") Long id);
}
