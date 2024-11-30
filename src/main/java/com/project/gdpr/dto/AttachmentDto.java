package com.project.gdpr.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class AttachmentDto {
    private UUID id;
    private UUID taskId;
    private String fileName;
    private String mimeType;
    private Integer fileSize;
    private LocalDateTime uploadedAt;
}
