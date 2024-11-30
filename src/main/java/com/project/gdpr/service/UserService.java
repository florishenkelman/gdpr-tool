package com.project.gdpr.service;

import com.project.gdpr.dto.UserDto;
import com.project.gdpr.dto.UserRegistrationDto;
import com.project.gdpr.dto.LoginDto;
import com.project.gdpr.dto.JwtResponseDto;
import com.project.gdpr.entity.User;
import com.project.gdpr.entity.UserRole;
import com.project.gdpr.config.JwtService;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.UnauthorizedAccessException;
import com.project.gdpr.exception.UserAlreadyExistsException;
import com.project.gdpr.exception.FileStorageException;
import com.project.gdpr.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.avatar.upload.dir}")
    private String uploadDir;

   @Transactional
    public UserDto createUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setUsername(registrationDto.getUsername());
        user.setPasswordHash(passwordEncoder.encode(registrationDto.getPassword()));
        user.setJobTitle(registrationDto.getJobTitle());
        user.setRole(registrationDto.getRole() != null ? registrationDto.getRole() : UserRole.VIEWER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Transactional
    public JwtResponseDto login(LoginDto loginDto) {
        // First check if the email exists
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new UnauthorizedAccessException("Invalid credentials"));

        // Then check the password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(user);
        UserDto userDto = convertToDto(user);

        JwtResponseDto jwtResponseDto = new JwtResponseDto();
        jwtResponseDto.setToken(jwtToken);
        jwtResponseDto.setUser(userDto);

        return jwtResponseDto;
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public UserDto updateUser(UUID id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        if (!user.getUsername().equals(userDto.getUsername()) && 
            userRepository.existsByUsername(userDto.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setJobTitle(userDto.getJobTitle());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUserRole(UUID id, UserRole newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());
        return convertToDto(userRepository.save(user));
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setJobTitle(user.getJobTitle());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    @Transactional
    public UserDto uploadAvatar(UUID id, MultipartFile file) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Validate file size (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.matches("image/(jpeg|png|gif)")) {
            throw new IllegalArgumentException("File must be JPEG, PNG, or GIF");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            @SuppressWarnings("null")
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFilename.contains("..")) {
                throw new IllegalArgumentException("Filename contains invalid path sequence");
            }
        
            String filename = id + "_" + System.currentTimeMillis() + "_" + originalFilename;
        
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update user avatar URL
            user.setAvatarUrl("/api/avatars/" + filename);
            user.setUpdatedAt(LocalDateTime.now());
        
            User updatedUser = userRepository.save(user);
            System.out.println("User avatar uploaded");
            return convertToDto(updatedUser);
        } catch (IOException ex) {
              throw new FileStorageException("Could not upload avatar", ex);
        }
    }
}