package com.project.gdpr.repository;

import com.project.gdpr.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    @Query("SELECT c FROM Comment c " +
           "JOIN FETCH c.user " +
           "WHERE c.task.id = :taskId " +
           "ORDER BY c.createdAt DESC")
    List<Comment> findByTaskIdWithUser(@Param("taskId") UUID taskId);
    List<Comment> findByTaskId(UUID taskId);
    List<Comment> findByUserId(UUID userId);
}