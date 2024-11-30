package com.project.gdpr.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "Tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "priority")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "status")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private TaskStatus status;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
