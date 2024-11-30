package com.project.gdpr;

import com.project.gdpr.dto.AttachmentDto;
import com.project.gdpr.entity.Attachment;
import com.project.gdpr.entity.Task;
import com.project.gdpr.exception.FileStorageException;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.repository.AttachmentRepository;
import com.project.gdpr.repository.TaskRepository;
import com.project.gdpr.service.AttachmentDownloadResponse;
import com.project.gdpr.service.AttachmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.UrlResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
class AttachmentServiceTest {

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private AttachmentService attachmentService;

    private UUID taskId;
    private UUID attachmentId;
    private Task task;
    private Attachment attachment;
    private MockMultipartFile multipartFile;
    private String uploadDir;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        attachmentId = UUID.randomUUID();
        uploadDir = System.getProperty("java.io.tmpdir");
        
        // Set up test data
        task = new Task();
        task.setId(taskId);
        task.setTitle("Test Task");

        attachment = new Attachment();
        attachment.setId(attachmentId);
        attachment.setTask(task);
        attachment.setFileName("test.txt");
        attachment.setFilePath(Paths.get(uploadDir, "test.txt").toString());
        attachment.setMimeType("text/plain");
        attachment.setFileSize(100);
        attachment.setUploadedAt(LocalDateTime.now());

        multipartFile = new MockMultipartFile(
            "file",
            "test.txt",
            "text/plain",
            "Hello, World!".getBytes()
        );

        // Set the upload directory using ReflectionTestUtils
        ReflectionTestUtils.setField(attachmentService, "uploadDir", uploadDir);
    }

    @Test
    void uploadFile_Success() throws IOException {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(attachmentRepository.save(any(Attachment.class))).thenReturn(attachment);

        AttachmentDto result = attachmentService.uploadFile(taskId, multipartFile);

        assertThat(result).isNotNull();
        assertThat(result.getTaskId()).isEqualTo(taskId);
        assertThat(result.getFileName()).isEqualTo("test.txt");
        verify(attachmentRepository).save(any(Attachment.class));
        
        // Clean up created file
        Path filePath = Paths.get(attachment.getFilePath());
        Files.deleteIfExists(filePath);
    }

    @Test
    void uploadFile_TaskNotFound_ThrowsException() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attachmentService.uploadFile(taskId, multipartFile))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Task not found with id: " + taskId);

        verify(attachmentRepository, never()).save(any(Attachment.class));
    }

    @Test
    void uploadFile_InvalidFileName_ThrowsException() {
        MockMultipartFile invalidFile = new MockMultipartFile(
            "file",
            "../test.txt",
            "text/plain",
            "Hello, World!".getBytes()
        );

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> attachmentService.uploadFile(taskId, invalidFile))
            .isInstanceOf(FileStorageException.class)
            .hasMessageContaining("Filename contains invalid path sequence");

        verify(attachmentRepository, never()).save(any(Attachment.class));
    }

    @Test
    void downloadFile_Success() throws IOException {
        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.of(attachment));
        
        // Create a temporary file for testing
        Path filePath = Paths.get(attachment.getFilePath());
        Files.write(filePath, "Hello, World!".getBytes());

        AttachmentDownloadResponse result = attachmentService.downloadFile(attachmentId);

        assertThat(result).isNotNull();
        assertThat(result.getAttachment()).isEqualTo(attachment);
        assertThat(result.getResource()).isNotNull();
        assertThat(result.getResource().exists()).isTrue();
        assertThat(result.getResource()).isInstanceOf(UrlResource.class);

        // Clean up
        Files.deleteIfExists(filePath);
    }

    @Test
    void downloadFile_NotFound_ThrowsException() {
        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attachmentService.downloadFile(attachmentId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Attachment not found with id: " + attachmentId);
    }

    @Test
    void getTaskAttachments_Success() {
        when(attachmentRepository.findByTaskId(taskId)).thenReturn(Arrays.asList(attachment));

        List<AttachmentDto> results = attachmentService.getTaskAttachments(taskId);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTaskId()).isEqualTo(taskId);
        assertThat(results.get(0).getFileName()).isEqualTo(attachment.getFileName());
    }

    @Test
    void deleteAttachment_Success() throws IOException {
        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.of(attachment));
        
        // Create a temporary file for testing
        Path filePath = Paths.get(attachment.getFilePath());
        Files.write(filePath, "Hello, World!".getBytes());

        attachmentService.deleteAttachment(attachmentId);

        verify(attachmentRepository).delete(attachment);
        assertThat(Files.exists(filePath)).isFalse();
    }

    @Test
    void deleteAttachment_NotFound_ThrowsException() {
        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> attachmentService.deleteAttachment(attachmentId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Attachment not found with id: " + attachmentId);

        verify(attachmentRepository, never()).delete(any(Attachment.class));
    }

    @Test
    void deleteAttachment_FileNotFound_Success() {
        when(attachmentRepository.findById(attachmentId)).thenReturn(Optional.of(attachment));

        // Set a non-existent file path
        attachment.setFilePath(Paths.get(uploadDir, "nonexistent.txt").toString());

        attachmentService.deleteAttachment(attachmentId);

        verify(attachmentRepository).delete(attachment);
    }
}
