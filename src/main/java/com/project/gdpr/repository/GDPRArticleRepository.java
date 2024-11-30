package com.project.gdpr.repository;

import com.project.gdpr.entity.GdprArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface GDPRArticleRepository extends JpaRepository<GdprArticle, UUID> {
    List<GdprArticle> findByArticleNumber(String articleNumber);
    
    @Query(value = "SELECT * FROM gdprarticles g WHERE " +
       "LOWER(g.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
       "LOWER(g.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
       "EXISTS (SELECT 1 FROM unnest(g.keywords) k WHERE LOWER(k) LIKE LOWER(CONCAT('%', :searchTerm, '%')))", 
       nativeQuery = true)
    List<GdprArticle> searchArticles(String searchTerm);
}