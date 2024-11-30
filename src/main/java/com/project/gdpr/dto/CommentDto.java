package com.project.gdpr.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private UUID id;
    private UUID taskId;
    private UUID userId;
    private UserDto user;
    private String content;
    private LocalDateTime createdAt;
}
