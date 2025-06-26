package com.expensetracker.controller;

import com.expensetracker.config.TestSecurityConfig;
import com.expensetracker.dto.JwtAuthenticationResponse;
import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.entity.User;
import com.expensetracker.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(TestSecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private JwtAuthenticationResponse jwtResponse;

    @BeforeEach
    void setUp() {
        // Given
        registerRequest = new RegisterRequest(
                "testuser",
                "test@example.com",
                "password123"
        );

        loginRequest = new LoginRequest(
                "testuser",
                "password123"
        );

        user = new User("testuser", "test@example.com", "encodedPassword");
        user.setId(1L);

        jwtResponse = new JwtAuthenticationResponse(
                "jwt-token",
                "testuser",
                "test@example.com"
        );
    }

    @Test
    void registerUser_ShouldReturnSuccessMessage_WhenValidRequest() throws Exception {
        // Given
        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenUsernameAlreadyExists() throws Exception {
        // Given
        when(authService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Error: Username is already taken!"));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Username is already taken!"));
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenEmailAlreadyExists() throws Exception {
        // Given
        when(authService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Error: Email is already in use!"));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Email is already in use!"));
    }

    @Test
    void authenticateUser_ShouldReturnJwtResponse_WhenValidCredentials() throws Exception {
        // Given
        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(jwtResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.type").value("Bearer"));
    }

    @Test
    void authenticateUser_ShouldReturnBadRequest_WhenInvalidCredentials() throws Exception {
        // Given
        when(authService.authenticateUser(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Error: Invalid username or password!"));
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Given - Invalid request with short username
        RegisterRequest invalidRequest = new RegisterRequest(
                "ab", // Too short username
                "test@example.com",
                "password123"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authenticateUser_ShouldReturnBadRequest_WhenMissingFields() throws Exception {
        // Given - Request with missing password
        LoginRequest invalidRequest = new LoginRequest("testuser", "");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
