package com.project.gdpr;

import com.project.gdpr.dto.TaskDto;
import com.project.gdpr.dto.TaskCreateDto;
import com.project.gdpr.dto.CommentDto;
import com.project.gdpr.entity.*;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.UnauthorizedAccessException;
import com.project.gdpr.repository.TaskRepository;
import com.project.gdpr.repository.UserRepository;
import com.project.gdpr.repository.CommentRepository;
import com.project.gdpr.service.TaskService;

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
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private TaskService taskService;

    private UUID taskId;
    private UUID creatorId;
    private UUID assigneeId;
    private Task task;
    private User creator;
    private User assignee;
    private TaskCreateDto taskCreateDto;
    private Comment comment;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        creatorId = UUID.randomUUID();
        assigneeId = UUID.randomUUID();

        creator = new User();
        creator.setId(creatorId);
        creator.setEmail("creator@example.com");
        creator.setRole(UserRole.ADMIN);

        assignee = new User();
        assignee.setId(assigneeId);
        assignee.setEmail("assignee@example.com");
        assignee.setRole(UserRole.VIEWER);

        task = new Task();
        task.setId(taskId);
        task.setCreator(creator);
        task.setAssignee(assignee);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setPriority(Priority.HIGH);
        task.setStatus(TaskStatus.OPEN);
        task.setDueDate(LocalDateTime.now().plusDays(7));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        taskCreateDto = new TaskCreateDto();
        taskCreateDto.setTitle("New Task");
        taskCreateDto.setDescription("New Description");
        taskCreateDto.setPriority(Priority.MEDIUM);
        taskCreateDto.setAssigneeId(assigneeId);
        taskCreateDto.setDueDate(LocalDateTime.now().plusDays(7));

        comment = new Comment();
        comment.setId(UUID.randomUUID());
        comment.setTask(task);
        comment.setUser(creator);
        comment.setContent("Test comment");
        comment.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTask_Success() {
        when(userRepository.findById(creatorId)).thenReturn(Optional.of(creator));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDto result = taskService.createTask(taskCreateDto, creatorId);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(task.getTitle());
        assertThat(result.getStatus()).isEqualTo(TaskStatus.OPEN);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void createTask_CreatorNotFound_ThrowsException() {
        when(userRepository.findById(creatorId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.createTask(taskCreateDto, creatorId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Creator not found");

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void getTaskById_Success() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        TaskDto result = taskService.getTaskById(taskId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(taskId);
        assertThat(result.getTitle()).isEqualTo(task.getTitle());
    }

    @Test
    void getTaskById_NotFound_ThrowsException() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(taskId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Task not found");
    }

    @Test
    void getTasksByAssignee_Success() {
        when(taskRepository.findByAssigneeId(assigneeId)).thenReturn(Arrays.asList(task));

        List<TaskDto> results = taskService.getTasksByAssignee(assigneeId);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getAssigneeId()).isEqualTo(assigneeId);
    }

    @Test
    void getTasksByCreator_Success() {
        when(taskRepository.findByCreatorId(creatorId)).thenReturn(Arrays.asList(task));

        List<TaskDto> results = taskService.getTasksByCreator(creatorId);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCreatorId()).isEqualTo(creatorId);
    }

    @Test
    void updateTaskStatus_Success() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDto result = taskService.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS, assigneeId);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTaskStatus_Unauthorized_ThrowsException() {
        UUID unauthorizedUserId = UUID.randomUUID();
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> taskService.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS, unauthorizedUserId))
            .isInstanceOf(UnauthorizedAccessException.class)
            .hasMessage("User not authorized to update this task");

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void updateTask_Success() {
        TaskDto updateDto = new TaskDto();
        updateDto.setTitle("Updated Title");
        updateDto.setDescription("Updated Description");
        updateDto.setStatus(TaskStatus.IN_PROGRESS);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDto result = taskService.updateTask(taskId, updateDto, creatorId);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(updateDto.getTitle());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void deleteTask_Success() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        doNothing().when(taskRepository).delete(task);

        taskService.deleteTask(taskId, creatorId);

        verify(taskRepository).delete(task);
    }

    @Test
    void deleteTask_Unauthorized_ThrowsException() {
        UUID unauthorizedUserId = UUID.randomUUID();
        User unauthorizedUser = new User();
        unauthorizedUser.setId(unauthorizedUserId);
        unauthorizedUser.setRole(UserRole.VIEWER);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(unauthorizedUserId)).thenReturn(Optional.of(unauthorizedUser));

        assertThatThrownBy(() -> taskService.deleteTask(taskId, unauthorizedUserId))
            .isInstanceOf(UnauthorizedAccessException.class)
            .hasMessage("User not authorized to delete this task");

        verify(taskRepository, never()).delete(any(Task.class));
    }


    @Test
    void addComment_Success() {
        String content = "New comment";
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(creatorId)).thenReturn(Optional.of(creator));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDto result = taskService.addComment(taskId, creatorId, content);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEqualTo(comment.getContent());
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getTaskComments_Success() {
        when(commentRepository.findByTaskId(taskId)).thenReturn(Arrays.asList(comment));

        List<CommentDto> results = taskService.getTaskComments(taskId);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getContent()).isEqualTo(comment.getContent());
    }
}
