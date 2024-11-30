package com.project.gdpr.dto;

import lombok.Data;
import com.project.gdpr.entity.UserRole;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String email;
    private String username;
    private String jobTitle;
    private UserRole role;
    private String avatarUrl;
}