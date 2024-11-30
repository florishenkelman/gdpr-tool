package com.project.gdpr.dto;

import lombok.Data;

@Data
public class PasswordResetDto {
    private String email;
    private String oldPassword;
    private String newPassword;
}
