package com.project.gdpr.dto;

import lombok.Data;

@Data
public class JwtResponseDto {
    private String token;
    private UserDto user;
}