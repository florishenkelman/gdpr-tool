package com.project.gdpr;

import com.project.gdpr.dto.GdprArticleDto;
import com.project.gdpr.dto.SavedArticleDto;
import com.project.gdpr.entity.GdprArticle;
import com.project.gdpr.entity.SavedArticle;
import com.project.gdpr.entity.User;
import com.project.gdpr.entity.UserRole;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.DuplicateResourceException;
import com.project.gdpr.repository.GDPRArticleRepository;
import com.project.gdpr.repository.SavedArticleRepository;
import com.project.gdpr.repository.UserRepository;
import com.project.gdpr.service.GdprArticleService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GdprArticleServiceTest {

    @Mock
    private GDPRArticleRepository gdprArticleRepository;

    @Mock
    private SavedArticleRepository savedArticleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GdprArticleService gdprArticleService;

    private UUID articleId;
    private UUID userId;
    private UUID savedArticleId;
    private GdprArticle article;
    private User user;
    private SavedArticle savedArticle;
    private GdprArticleDto articleDto;

    @BeforeEach
    void setUp() {
        articleId = UUID.randomUUID();
        userId = UUID.randomUUID();
        savedArticleId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setEmail("user@example.com");
        user.setRole(UserRole.ADMIN);

        article = new GdprArticle();
        article.setId(articleId);
        article.setArticleNumber("Art13");
        article.setTitle("Right to be Informed");
        article.setContent("Content about right to be informed");
        article.setKeywords(new String[]{"privacy", "information", "transparency"});
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());

        articleDto = new GdprArticleDto();
        articleDto.setId(articleId);
        articleDto.setArticleNumber("Art13");
        articleDto.setTitle("Right to be Informed");
        articleDto.setContent("Content about right to be informed");
        articleDto.setKeywords(new String[]{"privacy", "information", "transparency"});

        savedArticle = new SavedArticle();
        savedArticle.setId(savedArticleId);
        savedArticle.setUser(user);
        savedArticle.setArticle(article);
        savedArticle.setSavedAt(LocalDateTime.now());
    }

    @Test
    void getAllArticles_Success() {
        when(gdprArticleRepository.findAll()).thenReturn(Arrays.asList(article));

        List<GdprArticleDto> results = gdprArticleService.getAllArticles();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getArticleNumber()).isEqualTo(article.getArticleNumber());
    }

    @Test
    void getArticleById_Success() {
        when(gdprArticleRepository.findById(articleId)).thenReturn(Optional.of(article));

        GdprArticleDto result = gdprArticleService.getArticleById(articleId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(articleId);
        assertThat(result.getTitle()).isEqualTo(article.getTitle());
    }

    @Test
    void getArticleById_NotFound_ThrowsException() {
        when(gdprArticleRepository.findById(articleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gdprArticleService.getArticleById(articleId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Article not found");
    }

    @Test
    void searchArticles_Success() {
        String searchTerm = "privacy";
        when(gdprArticleRepository.searchArticles(searchTerm)).thenReturn(Arrays.asList(article));

        List<GdprArticleDto> results = gdprArticleService.searchArticles(searchTerm);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getKeywords()).contains(searchTerm);
    }

    @Test
    void getArticlesByNumber_Success() {
        String articleNumber = "Art13";
        when(gdprArticleRepository.findByArticleNumber(articleNumber)).thenReturn(Arrays.asList(article));

        List<GdprArticleDto> results = gdprArticleService.getArticlesByNumber(articleNumber);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getArticleNumber()).isEqualTo(articleNumber);
    }

    @Test
    void saveArticleForUser_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(gdprArticleRepository.findById(articleId)).thenReturn(Optional.of(article));
        when(savedArticleRepository.existsByUserIdAndArticleId(userId, articleId)).thenReturn(false);
        when(savedArticleRepository.save(any(SavedArticle.class))).thenReturn(savedArticle);

        SavedArticleDto result = gdprArticleService.saveArticleForUser(articleId, userId);

        assertThat(result).isNotNull();
        assertThat(result.getArticleId()).isEqualTo(articleId);
        verify(savedArticleRepository).save(any(SavedArticle.class));
    }

    @Test
    void saveArticleForUser_AlreadySaved_ThrowsException() {
        when(savedArticleRepository.existsByUserIdAndArticleId(userId, articleId)).thenReturn(true);

        assertThatThrownBy(() -> gdprArticleService.saveArticleForUser(articleId, userId))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessage("Article already saved for this user");

        verify(savedArticleRepository, never()).save(any(SavedArticle.class));
    }

    @Test
    void getUserSavedArticles_Success() {
        when(userRepository.existsById(userId)).thenReturn(true);
        when(savedArticleRepository.findByUserId(userId)).thenReturn(Arrays.asList(savedArticle));

        List<SavedArticleDto> results = gdprArticleService.getUserSavedArticles(userId);

        assertThat(results).hasSize(1);
    }

    @Test
    void removeSavedArticle_Success() {
        when(savedArticleRepository.findById(savedArticleId)).thenReturn(Optional.of(savedArticle));
        doNothing().when(savedArticleRepository).delete(savedArticle);

        gdprArticleService.removeSavedArticle(userId, savedArticleId);

        verify(savedArticleRepository).delete(savedArticle);
    }

    @Test
    void createArticle_Success() {
        when(gdprArticleRepository.save(any(GdprArticle.class))).thenReturn(article);

        GdprArticleDto result = gdprArticleService.createArticle(articleDto);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(articleDto.getTitle());
        verify(gdprArticleRepository).save(any(GdprArticle.class));
    }

    @Test
    void updateArticle_Success() {
        when(gdprArticleRepository.findById(articleId)).thenReturn(Optional.of(article));
        when(gdprArticleRepository.save(any(GdprArticle.class))).thenReturn(article);

        GdprArticleDto result = gdprArticleService.updateArticle(articleId, articleDto);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(articleDto.getTitle());
        verify(gdprArticleRepository).save(any(GdprArticle.class));
    }

    @Test
    void updateArticle_NotFound_ThrowsException() {
        when(gdprArticleRepository.findById(articleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gdprArticleService.updateArticle(articleId, articleDto))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Article not found");

        verify(gdprArticleRepository, never()).save(any(GdprArticle.class));
    }

    @Test
    void deleteArticle_Success() {
        when(gdprArticleRepository.existsById(articleId)).thenReturn(true);
        doNothing().when(gdprArticleRepository).deleteById(articleId);

        gdprArticleService.deleteArticle(articleId);

        verify(gdprArticleRepository).deleteById(articleId);
    }

    @Test
    void deleteArticle_NotFound_ThrowsException() {
        when(gdprArticleRepository.existsById(articleId)).thenReturn(false);

        assertThatThrownBy(() -> gdprArticleService.deleteArticle(articleId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Article not found");

        verify(gdprArticleRepository, never()).deleteById(any(UUID.class));
    }
}
