package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ExpenseResponse response = expenseService.createExpense(request, username);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(username);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ExpenseResponse expense = expenseService.getExpenseById(id, username);
        return ResponseEntity.ok(expense);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id, 
                                                        @Valid @RequestBody ExpenseRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ExpenseResponse response = expenseService.updateExpense(id, request, username);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        expenseService.deleteExpense(id, username);
        return ResponseEntity.ok().body("Expense deleted successfully!");
    }
}
