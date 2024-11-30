package com.project.gdpr.service;

import com.project.gdpr.dto.AttachmentDto;
import com.project.gdpr.entity.Attachment;
import com.project.gdpr.entity.Task;
import com.project.gdpr.exception.FileStorageException;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.repository.AttachmentRepository;
import com.project.gdpr.repository.TaskRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    
    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public AttachmentDto uploadFile(UUID taskId, MultipartFile file) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        @SuppressWarnings("null")
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the filename contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence: " + fileName);
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = uploadPath.resolve(uniqueFileName);

            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create and save attachment entity
            Attachment attachment = new Attachment();
            attachment.setTask(task);
            attachment.setFileName(fileName);
            attachment.setFilePath(targetLocation.toString());
            attachment.setMimeType(file.getContentType());
            attachment.setFileSize((int) file.getSize());

            attachment = attachmentRepository.save(attachment);
            
            return convertToDto(attachment);

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Transactional(readOnly = true)
    public AttachmentDownloadResponse downloadFile(UUID attachmentId) {
        try {
            Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

            Path filePath = Paths.get(attachment.getFilePath()).toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new FileStorageException("File not found: " + attachment.getFileName());
            }

            return new AttachmentDownloadResponse(attachment, resource);
        } catch (MalformedURLException ex) {
            throw new FileStorageException("File not found", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<AttachmentDto> getTaskAttachments(UUID taskId) {
        return attachmentRepository.findByTaskId(taskId).stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAttachment(UUID attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        try {
            // Delete file from filesystem
            Path filePath = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(filePath);

            // Delete database record
            attachmentRepository.delete(attachment);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file", ex);
        }
    }

    private AttachmentDto convertToDto(Attachment attachment) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(attachment.getId());
        dto.setTaskId(attachment.getTask().getId());
        dto.setFileName(attachment.getFileName());
        dto.setMimeType(attachment.getMimeType());
        dto.setFileSize(attachment.getFileSize());
        dto.setUploadedAt(attachment.getUploadedAt());
        return dto;
    }
}

