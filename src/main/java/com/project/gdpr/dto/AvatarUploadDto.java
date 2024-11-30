package com.project.gdpr.dto;

import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

@Data
public class AvatarUploadDto {
    private UUID userId;
    private MultipartFile file;
}
