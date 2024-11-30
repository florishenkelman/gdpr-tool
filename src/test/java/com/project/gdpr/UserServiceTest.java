package com.project.gdpr;

import com.project.gdpr.dto.UserDto;
import com.project.gdpr.dto.UserRegistrationDto;
import com.project.gdpr.entity.User;
import com.project.gdpr.entity.UserRole;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.exception.UserAlreadyExistsException;
import com.project.gdpr.repository.UserRepository;
import com.project.gdpr.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserRegistrationDto registrationDto;
    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        
        registrationDto = new UserRegistrationDto();
        registrationDto.setEmail("test@example.com");
        registrationDto.setUsername("testuser");
        registrationDto.setPassword("password123");
        registrationDto.setJobTitle("Developer");

        user = new User();
        user.setId(userId);
        user.setEmail(registrationDto.getEmail());
        user.setUsername(registrationDto.getUsername());
        user.setPasswordHash("hashedPassword");
        user.setJobTitle(registrationDto.getJobTitle());
        user.setRole(UserRole.VIEWER);
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = userService.createUser(registrationDto);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com"); 
        assertThat(result.getJobTitle()).isEqualTo(registrationDto.getJobTitle());
        assertThat(result.getRole()).isEqualTo(UserRole.VIEWER);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_EmailExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(registrationDto))
            .isInstanceOf(UserAlreadyExistsException.class)
            .hasMessage("Email already registered");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_UsernameExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(registrationDto))
            .isInstanceOf(UserAlreadyExistsException.class)
            .hasMessage("Username already taken");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserDto result = userService.getUserById(userId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(userId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("User not found");
    }

    @Test
    void getUserByEmail_Success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        UserDto result = userService.getUserByEmail(user.getEmail());

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getUsername()).isEqualTo(user.getUsername());
    }

    @Test
    void getUserByEmail_NotFound_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByEmail("nonexistent@example.com"))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("User not found");
    }

    @Test
    void updateUser_Success() {
        UserDto updateDto = new UserDto();
        updateDto.setId(userId);
        updateDto.setEmail("updated@example.com");
        updateDto.setUsername("updateduser");
        updateDto.setJobTitle("Senior Developer");
        updateDto.setRole(UserRole.VIEWER);

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("old@example.com");
        existingUser.setUsername("olduser");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail(updateDto.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(updateDto.getUsername())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        UserDto result = userService.updateUser(userId, updateDto);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("updated@example.com"); 
        assertThat(result.getJobTitle()).isEqualTo(updateDto.getJobTitle());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_EmailExists_ThrowsException() {
        UserDto updateDto = new UserDto();
        updateDto.setId(userId);
        updateDto.setEmail("existing@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(updateDto.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> userService.updateUser(userId, updateDto))
            .isInstanceOf(UserAlreadyExistsException.class)
            .hasMessage("Email already registered");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        userService.deleteUser(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_NotFound_ThrowsException() {
        when(userRepository.existsById(userId)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(userId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("User not found");

        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void getAllUsers_Success() {
        User user2 = new User();
        user2.setId(UUID.randomUUID());
        user2.setEmail("user2@example.com");
        user2.setUsername("user2");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user, user2));

        List<UserDto> results = userService.getAllUsers();

        assertThat(results).hasSize(2);
        assertThat(results.get(0).getEmail()).isEqualTo(user.getEmail());
        assertThat(results.get(1).getEmail()).isEqualTo(user2.getEmail());
    }

    @Test
    void updateUserRole_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto result = userService.updateUserRole(userId, UserRole.EDITOR);

        assertThat(result).isNotNull();
        assertThat(result.getRole()).isEqualTo(UserRole.EDITOR);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserRole_UserNotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUserRole(userId, UserRole.EDITOR))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("User not found");

        verify(userRepository, never()).save(any(User.class));
    }
}
