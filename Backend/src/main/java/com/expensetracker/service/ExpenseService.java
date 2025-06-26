package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ExpenseResponse createExpense(ExpenseRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = new Expense(
                request.getTitle(),
                request.getDescription(),
                request.getAmount(),
                request.getCategory(),
                request.getExpenseDate(),
                user
        );
        
        Expense savedExpense = expenseRepository.save(expense);
        return convertToResponse(savedExpense);
    }
    
    public List<ExpenseResponse> getAllExpenses(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        return expenses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ExpenseResponse getExpenseById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or access denied"));
        
        return convertToResponse(expense);
    }
    
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or access denied"));
        
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        
        Expense updatedExpense = expenseRepository.save(expense);
        return convertToResponse(updatedExpense);
    }
    
    @Transactional
    public void deleteExpense(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found or access denied"));
        
        expenseRepository.delete(expense);
    }
    
    private ExpenseResponse convertToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}
