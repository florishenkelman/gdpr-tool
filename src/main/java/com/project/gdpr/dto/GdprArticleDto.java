package com.project.gdpr.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class GdprArticleDto {
    private UUID id;
    private String articleNumber;
    private String title;
    private String content;
    private String[] keywords;
}