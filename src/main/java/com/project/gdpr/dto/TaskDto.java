package com.project.gdpr.dto;

import lombok.Data;
import com.project.gdpr.entity.Priority;
import com.project.gdpr.entity.TaskStatus;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskDto {
    private UUID id;
    private UUID creatorId;
    private UUID assigneeId;
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}