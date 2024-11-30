package com.project.gdpr.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class SavedArticleDto {
    private UUID id;
    private UUID articleId;
    private String articleNumber;
    private String title;
    private String content; 
    private String[] keywords;
    private LocalDateTime savedAt;
}