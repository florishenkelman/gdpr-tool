package com.project.gdpr.service;

import com.project.gdpr.dto.GdprArticleDto;
import com.project.gdpr.dto.SavedArticleDto;
import com.project.gdpr.entity.GdprArticle;
import com.project.gdpr.entity.SavedArticle;
import com.project.gdpr.entity.User;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.DuplicateResourceException;
import com.project.gdpr.repository.GDPRArticleRepository;
import com.project.gdpr.repository.SavedArticleRepository;
import com.project.gdpr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GdprArticleService {
    private final GDPRArticleRepository gdprArticleRepository;
    private final SavedArticleRepository savedArticleRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<GdprArticleDto> getAllArticles() {
        return gdprArticleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GdprArticleDto getArticleById(UUID id) {
        return gdprArticleRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));
    }

    @Transactional(readOnly = true)
    public List<GdprArticleDto> searchArticles(String searchTerm) {
        try {
            List<GdprArticle> searchResults = gdprArticleRepository.searchArticles(searchTerm);
            return searchResults.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the full exception details
            System.err.println("Error searching articles: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error searching articles", e);
       }
    }

    @Transactional(readOnly = true)
    public List<GdprArticleDto> getArticlesByNumber(String articleNumber) {
        return gdprArticleRepository.findByArticleNumber(articleNumber).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedArticleDto saveArticleForUser(UUID articleId, UUID userId) {
        if (savedArticleRepository.existsByUserIdAndArticleId(userId, articleId)) {
            throw new DuplicateResourceException("Article already saved for this user");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        GdprArticle article = gdprArticleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        SavedArticle savedArticle = new SavedArticle();
        savedArticle.setUser(user);
        savedArticle.setArticle(article);
        savedArticle.setSavedAt(LocalDateTime.now());

        return convertSavedArticleToDto(savedArticleRepository.save(savedArticle));
    }

    @Transactional(readOnly = true)
    public List<SavedArticleDto> getUserSavedArticles(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }

        // Using join fetch to prevent N+1 problem
        return savedArticleRepository.findByUserId(userId).stream()
                .map(this::convertSavedArticleToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeSavedArticle(UUID userId, UUID savedArticleId) {
        SavedArticle savedArticle = savedArticleRepository.findById(savedArticleId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved article not found"));

        if (!savedArticle.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Saved article not found for this user");
        }

        savedArticleRepository.delete(savedArticle);
    }

    @Transactional
    public GdprArticleDto createArticle(GdprArticleDto articleDto) {
        GdprArticle article = new GdprArticle();
        article.setArticleNumber(articleDto.getArticleNumber());
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setKeywords(articleDto.getKeywords());

        return convertToDto(gdprArticleRepository.save(article));
    }

    @Transactional
    public GdprArticleDto updateArticle(UUID id, GdprArticleDto articleDto) {
        GdprArticle article = gdprArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        article.setArticleNumber(articleDto.getArticleNumber());
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setKeywords(articleDto.getKeywords());

        return convertToDto(gdprArticleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(UUID id) {
        if (!gdprArticleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article not found");
        }
        gdprArticleRepository.deleteById(id);
    }

    private GdprArticleDto convertToDto(GdprArticle article) {
        GdprArticleDto dto = new GdprArticleDto();
        dto.setId(article.getId());
        dto.setArticleNumber(article.getArticleNumber());
        dto.setTitle(article.getTitle());
        dto.setContent(article.getContent());
        dto.setKeywords(article.getKeywords());
        return dto;
    }

    private SavedArticleDto convertSavedArticleToDto(SavedArticle savedArticle) {
        SavedArticleDto dto = new SavedArticleDto();
        dto.setId(savedArticle.getId());
        dto.setArticleId(savedArticle.getArticle().getId());
        dto.setArticleNumber(savedArticle.getArticle().getArticleNumber());
        dto.setTitle(savedArticle.getArticle().getTitle());
        dto.setContent(savedArticle.getArticle().getContent());  // Added content
        dto.setKeywords(savedArticle.getArticle().getKeywords());
        dto.setSavedAt(savedArticle.getSavedAt());
        return dto;
    }
}