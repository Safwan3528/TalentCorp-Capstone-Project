package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User user;
    private Expense expense;
    private ExpenseRequest expenseRequest;

    @BeforeEach
    void setUp() {
        // Given
        user = new User("testuser", "test@example.com", "password");
        user.setId(1L);

        expense = new Expense(
                "Grocery Shopping",
                "Weekly grocery shopping",
                new BigDecimal("150.00"),
                "Food",
                LocalDate.now(),
                user
        );
        expense.setId(1L);
        expense.setCreatedAt(LocalDateTime.now());
        expense.setUpdatedAt(LocalDateTime.now());

        expenseRequest = new ExpenseRequest(
                "Grocery Shopping",
                "Weekly grocery shopping",
                new BigDecimal("150.00"),
                "Food",
                LocalDate.now()
        );
    }

    @Test
    void createExpense_ShouldReturnExpenseResponse_WhenValidRequest() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        // When
        ExpenseResponse result = expenseService.createExpense(expenseRequest, "testuser");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Grocery Shopping", result.getTitle());
        assertEquals("Weekly grocery shopping", result.getDescription());
        assertEquals(new BigDecimal("150.00"), result.getAmount());
        assertEquals("Food", result.getCategory());

        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void createExpense_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> expenseService.createExpense(expenseRequest, "testuser"));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void getAllExpenses_ShouldReturnExpenseList_WhenUserExists() {
        // Given
        List<Expense> expenses = Arrays.asList(expense);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByUserId(1L)).thenReturn(expenses);

        // When
        List<ExpenseResponse> result = expenseService.getAllExpenses("testuser");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Grocery Shopping", result.get(0).getTitle());

        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByUserId(1L);
    }

    @Test
    void getAllExpenses_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> expenseService.getAllExpenses("testuser"));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository, never()).findByUserId(any());
    }

    @Test
    void getExpenseById_ShouldReturnExpenseResponse_WhenExpenseExists() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(expense));

        // When
        ExpenseResponse result = expenseService.getExpenseById(1L, "testuser");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Grocery Shopping", result.getTitle());

        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByIdAndUserId(1L, 1L);
    }

    @Test
    void getExpenseById_ShouldThrowException_WhenExpenseNotFound() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> expenseService.getExpenseById(1L, "testuser"));

        assertEquals("Expense not found or access denied", exception.getMessage());
        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByIdAndUserId(1L, 1L);
    }

    @Test
    void updateExpense_ShouldReturnUpdatedExpenseResponse_WhenValidRequest() {
        // Given
        ExpenseRequest updateRequest = new ExpenseRequest(
                "Updated Title",
                "Updated Description",
                new BigDecimal("200.00"),
                "Entertainment",
                LocalDate.now()
        );

        Expense updatedExpense = new Expense(
                "Updated Title",
                "Updated Description",
                new BigDecimal("200.00"),
                "Entertainment",
                LocalDate.now(),
                user
        );
        updatedExpense.setId(1L);
        updatedExpense.setCreatedAt(LocalDateTime.now());
        updatedExpense.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(updatedExpense);

        // When
        ExpenseResponse result = expenseService.updateExpense(1L, updateRequest, "testuser");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(new BigDecimal("200.00"), result.getAmount());
        assertEquals("Entertainment", result.getCategory());

        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByIdAndUserId(1L, 1L);
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void deleteExpense_ShouldDeleteExpense_WhenExpenseExists() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(expense));

        // When
        assertDoesNotThrow(() -> expenseService.deleteExpense(1L, "testuser"));

        // Then
        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByIdAndUserId(1L, 1L);
        verify(expenseRepository).delete(expense);
    }

    @Test
    void deleteExpense_ShouldThrowException_WhenExpenseNotFound() {
        // Given
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(expenseRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> expenseService.deleteExpense(1L, "testuser"));

        assertEquals("Expense not found or access denied", exception.getMessage());
        verify(userRepository).findByUsername("testuser");
        verify(expenseRepository).findByIdAndUserId(1L, 1L);
        verify(expenseRepository, never()).delete(any(Expense.class));
    }
}
