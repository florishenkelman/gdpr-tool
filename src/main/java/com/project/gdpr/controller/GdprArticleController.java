package com.project.gdpr.controller;

import com.project.gdpr.dto.*;
import com.project.gdpr.service.GdprArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gdpr")
@RequiredArgsConstructor
public class GdprArticleController {
    private final GdprArticleService gdprArticleService;

    @GetMapping
    public ResponseEntity<List<GdprArticleDto>> getAllArticles() {
        return ResponseEntity.ok(gdprArticleService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GdprArticleDto> getArticle(@PathVariable UUID id) {
        return ResponseEntity.ok(gdprArticleService.getArticleById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GdprArticleDto>> searchArticles(@RequestParam(required = false) String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return ResponseEntity.ok(gdprArticleService.getAllArticles());
        }
        return ResponseEntity.ok(gdprArticleService.searchArticles(searchTerm));
    }
    @GetMapping("/number/{articleNumber}")
    public ResponseEntity<List<GdprArticleDto>> getArticlesByNumber(@PathVariable String articleNumber) {
        return ResponseEntity.ok(gdprArticleService.getArticlesByNumber(articleNumber));
    }

    @PostMapping("/saved/{articleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<SavedArticleDto> saveArticle(
            @PathVariable UUID articleId,
            @RequestAttribute UUID currentUserId) {
        return ResponseEntity.ok(gdprArticleService.saveArticleForUser(articleId, currentUserId));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<SavedArticleDto>> getSavedArticles(@RequestAttribute UUID currentUserId) {
        return ResponseEntity.ok(gdprArticleService.getUserSavedArticles(currentUserId));
    }

    @DeleteMapping("/saved/{savedArticleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<Void> removeSavedArticle(
            @PathVariable UUID savedArticleId,
            @RequestAttribute UUID currentUserId) {
        gdprArticleService.removeSavedArticle(currentUserId, savedArticleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GdprArticleDto> createArticle(@Valid @RequestBody GdprArticleDto articleDto) {
        return ResponseEntity.ok(gdprArticleService.createArticle(articleDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GdprArticleDto> updateArticle(
            @PathVariable UUID id,
            @Valid @RequestBody GdprArticleDto articleDto) {
        return ResponseEntity.ok(gdprArticleService.updateArticle(id, articleDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable UUID id) {
        gdprArticleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}