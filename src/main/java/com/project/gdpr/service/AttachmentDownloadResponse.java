package com.project.gdpr.service;

import com.project.gdpr.entity.Attachment;
import org.springframework.core.io.Resource;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttachmentDownloadResponse {
    private final Attachment attachment;
    private final Resource resource;
}
