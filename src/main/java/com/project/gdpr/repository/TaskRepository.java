package com.project.gdpr.repository;

import com.project.gdpr.entity.Task;
import com.project.gdpr.entity.TaskStatus;
import com.project.gdpr.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByAssigneeId(UUID assigneeId);
    List<Task> findByCreatorId(UUID creatorId);
    
    @Query("SELECT t FROM Task t WHERE " +
   "(LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
   "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
   "(:status IS NULL OR t.status = :status) AND " +
   "(:priority IS NULL OR t.priority = :priority)")
    List<Task> searchTasks(
    @Param("searchTerm") String searchTerm, 
    @Param("status") TaskStatus status, 
    @Param("priority") Priority priority
    );
    
    List<Task> findByStatus(String status);
    List<Task> findByPriority(String priority);
}