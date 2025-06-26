package com.expensetracker.controller;

import com.expensetracker.config.TestSecurityConfig;
import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.service.ExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExpenseController.class)
@Import(TestSecurityConfig.class)
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExpenseService expenseService;

    @Autowired
    private ObjectMapper objectMapper;

    private ExpenseRequest expenseRequest;
    private ExpenseResponse expenseResponse;

    @BeforeEach
    void setUp() {
        // Given
        expenseRequest = new ExpenseRequest(
                "Grocery Shopping",
                "Weekly grocery shopping",
                new BigDecimal("150.00"),
                "Food",
                LocalDate.now()
        );

        expenseResponse = new ExpenseResponse(
                1L,
                "Grocery Shopping",
                "Weekly grocery shopping",
                new BigDecimal("150.00"),
                "Food",
                LocalDate.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @WithMockUser(username = "testuser")
    void createExpense_ShouldReturnExpenseResponse_WhenValidRequest() throws Exception {
        // Given
        when(expenseService.createExpense(any(ExpenseRequest.class), eq("testuser")))
                .thenReturn(expenseResponse);

        // When & Then
        mockMvc.perform(post("/api/expenses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expenseRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Grocery Shopping"))
                .andExpect(jsonPath("$.description").value("Weekly grocery shopping"))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getAllExpenses_ShouldReturnListOfExpenses() throws Exception {
        // Given
        List<ExpenseResponse> expenses = Arrays.asList(expenseResponse);
        when(expenseService.getAllExpenses("testuser")).thenReturn(expenses);

        // When & Then
        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Grocery Shopping"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getExpenseById_ShouldReturnExpense_WhenExpenseExists() throws Exception {
        // Given
        when(expenseService.getExpenseById(1L, "testuser")).thenReturn(expenseResponse);

        // When & Then
        mockMvc.perform(get("/api/expenses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Grocery Shopping"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateExpense_ShouldReturnUpdatedExpenseResponse_WhenValidRequest() throws Exception {
        // Given
        ExpenseResponse updatedResponse = new ExpenseResponse(
                1L,
                "Updated Grocery Shopping",
                "Updated description",
                new BigDecimal("200.00"),
                "Food",
                LocalDate.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        ExpenseRequest updateRequest = new ExpenseRequest(
                "Updated Grocery Shopping",
                "Updated description",
                new BigDecimal("200.00"),
                "Food",
                LocalDate.now()
        );

        when(expenseService.updateExpense(eq(1L), any(ExpenseRequest.class), eq("testuser")))
                .thenReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/expenses/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Updated Grocery Shopping"))
                .andExpect(jsonPath("$.description").value("Updated description"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void deleteExpense_ShouldReturnSuccessMessage_WhenExpenseExists() throws Exception {
        // Given
        doNothing().when(expenseService).deleteExpense(1L, "testuser");

        // When & Then
        mockMvc.perform(delete("/api/expenses/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Expense deleted successfully!"));
    }

    @Test
    void createExpense_ShouldReturn401_WhenNotAuthenticated() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/expenses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(expenseRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void createExpense_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Given - Invalid request with null title
        ExpenseRequest invalidRequest = new ExpenseRequest(
                null, // Invalid title
                "Description",
                new BigDecimal("100.00"),
                "Food",
                LocalDate.now()
        );

        // When & Then
        mockMvc.perform(post("/api/expenses")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
