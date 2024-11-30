package com.project.gdpr.controller;

import com.project.gdpr.dto.*;
import com.project.gdpr.entity.TaskStatus;
import com.project.gdpr.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<TaskDto> createTask(
            @Valid @RequestBody TaskCreateDto taskDto,
            @RequestAttribute UUID currentUserId) {
        return ResponseEntity.ok(taskService.createTask(taskDto, currentUserId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<TaskDto> getTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/assignee/{assigneeId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#assigneeId)")
    public ResponseEntity<List<TaskDto>> getTasksByAssignee(@PathVariable UUID assigneeId) {
        return ResponseEntity.ok(taskService.getTasksByAssignee(assigneeId));
    }

    @GetMapping("/creator/{creatorId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#creatorId)")
    public ResponseEntity<List<TaskDto>> getTasksByCreator(@PathVariable UUID creatorId) {
        return ResponseEntity.ok(taskService.getTasksByCreator(creatorId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<TaskDto> updateTaskStatus(
            @PathVariable UUID id,
            @RequestBody TaskStatus newStatus,
            @RequestAttribute UUID currentUserId) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, newStatus, currentUserId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody TaskDto taskDto,
            @RequestAttribute UUID currentUserId) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDto, currentUserId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR') or @userSecurity.isCurrentUser(#creatorId)")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            @RequestAttribute UUID currentUserId) {
        taskService.deleteTask(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<List<TaskDto>> searchTasks(
        @RequestParam(required = false, defaultValue = "") String searchTerm,
        @RequestParam(required = false, defaultValue = "ALL") String status,
        @RequestParam(required = false, defaultValue = "ALL") String priority
     ) {
        return ResponseEntity.ok(taskService.searchTasks(searchTerm, status, priority));
    }

    @PostMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable UUID taskId,
            @RequestAttribute UUID currentUserId,
            @RequestBody String content) {
        return ResponseEntity.ok(taskService.addComment(taskId, currentUserId, content));
    }

    @GetMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<List<CommentDto>> getTaskComments(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskService.getTaskComments(taskId));
    }
}
