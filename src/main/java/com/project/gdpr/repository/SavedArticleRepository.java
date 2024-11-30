package com.project.gdpr.repository;

import com.project.gdpr.entity.SavedArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SavedArticleRepository extends JpaRepository<SavedArticle, UUID> {
    @Query("SELECT sa FROM SavedArticle sa " +
           "JOIN FETCH sa.article " +
           "WHERE sa.user.id = :userId")
    List<SavedArticle> findByUserId(UUID userId);
    boolean existsByUserIdAndArticleId(UUID userId, UUID articleId);
}