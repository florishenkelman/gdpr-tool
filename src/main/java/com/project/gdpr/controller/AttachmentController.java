package com.project.gdpr.controller;

import com.project.gdpr.dto.*;
import com.project.gdpr.entity.Attachment;
import com.project.gdpr.service.AttachmentDownloadResponse;
import com.project.gdpr.service.AttachmentService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {
    private final AttachmentService attachmentService;

    @PostMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VIEWER', 'EDITOR')")
    public ResponseEntity<AttachmentDto> uploadFile(
            @PathVariable UUID taskId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(attachmentService.uploadFile(taskId, file));
    }

    @GetMapping("/{attachmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VIEWER', 'EDITOR')")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID attachmentId) {
        AttachmentDownloadResponse downloadResponse = attachmentService.downloadFile(attachmentId);
        Attachment attachment = downloadResponse.getAttachment();
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(
                attachment.getMimeType() != null ? 
                attachment.getMimeType() : 
                MediaType.APPLICATION_OCTET_STREAM_VALUE
            ))
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                ContentDisposition.attachment()
                    .filename(attachment.getFileName(), StandardCharsets.UTF_8)
                    .build().toString()
            )
            .body(downloadResponse.getResource());
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VIEWER', 'EDITOR')")
    public ResponseEntity<List<AttachmentDto>> getTaskAttachments(@PathVariable UUID taskId) {
        return ResponseEntity.ok(attachmentService.getTaskAttachments(taskId));
    }

    @DeleteMapping("/{attachmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<Void> deleteAttachment(@PathVariable UUID attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build();
    }
}