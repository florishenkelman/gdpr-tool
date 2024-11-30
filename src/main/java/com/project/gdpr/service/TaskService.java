package com.project.gdpr.service;

import com.project.gdpr.dto.TaskDto;
import com.project.gdpr.dto.UserDto;
import com.project.gdpr.dto.TaskCreateDto;
import com.project.gdpr.dto.CommentDto;
import com.project.gdpr.entity.*;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.UnauthorizedAccessException;
import com.project.gdpr.repository.TaskRepository;
import com.project.gdpr.repository.CommentRepository;
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
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    @Transactional
    public TaskDto createTask(TaskCreateDto createDto, UUID creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        
        User assignee = null;
        if (createDto.getAssigneeId() != null) {
            assignee = userRepository.findById(createDto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Task task = new Task();
        task.setCreator(creator);
        task.setAssignee(assignee);
        task.setTitle(createDto.getTitle());
        task.setDescription(createDto.getDescription());
        task.setPriority(createDto.getPriority());
        task.setStatus(TaskStatus.OPEN);
        task.setDueDate(createDto.getDueDate());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return convertToDto(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(UUID id) {
        return taskRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByAssignee(UUID assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByCreator(UUID creatorId) {
        return taskRepository.findByCreatorId(creatorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto updateTaskStatus(UUID taskId, TaskStatus newStatus, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // Check if user is authorized to update the task
        if (!isUserAuthorizedForTask(task, userId)) {
            throw new UnauthorizedAccessException("User not authorized to update this task");
        }

        task.setStatus(newStatus);
        task.setUpdatedAt(LocalDateTime.now());
        return convertToDto(taskRepository.save(task));
    }

    @Transactional
    public TaskDto updateTask(UUID taskId, TaskDto taskDto, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!isUserAuthorizedForTask(task, userId)) {
            throw new UnauthorizedAccessException("User not authorized to update this task");
        }

        if (taskDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setStatus(taskDto.getStatus());
        task.setDueDate(taskDto.getDueDate());
        task.setUpdatedAt(LocalDateTime.now());

        return convertToDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!canDeleteTask(task, userId)) {
            throw new UnauthorizedAccessException("User not authorized to delete this task");
        }

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> searchTasks(String searchTerm, String status, String priority) {
        TaskStatus taskStatus = (status != null && !status.equals("ALL")) ? TaskStatus.valueOf(status) : null;
        Priority taskPriority = (priority != null && !priority.equals("ALL")) ? Priority.valueOf(priority) : null;

        return taskRepository.searchTasks(
            searchTerm != null ? searchTerm : "", 
            taskStatus, 
            taskPriority
        ).stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto addComment(UUID taskId, UUID userId, String content) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setTask(task);
        comment.setUser(user);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);
        return convertCommentToDto(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getTaskComments(UUID taskId) {
        return commentRepository.findByTaskIdWithUser(taskId).stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
    }

    private boolean isUserAuthorizedForTask(Task task, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Admin users have full access
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }

        // Task creator and assignee have access
        return task.getCreator().getId().equals(userId) ||
                (task.getAssignee() != null && task.getAssignee().getId().equals(userId));
    }

    private boolean canDeleteTask(Task task, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user.getRole() == UserRole.ADMIN || task.getCreator().getId().equals(userId);
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setCreatorId(task.getCreator().getId());
        dto.setAssigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null);
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    private CommentDto convertCommentToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setTaskId(comment.getTask().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        
        // Add user details
        UserDto userDto = new UserDto();
        userDto.setId(comment.getUser().getId());
        userDto.setUsername(comment.getUser().getUsername());
        userDto.setEmail(comment.getUser().getEmail());
        dto.setUser(userDto);
        
        return dto;
    }
}