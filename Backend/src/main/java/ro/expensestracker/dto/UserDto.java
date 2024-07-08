package ro.expensestracker.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import ro.expensestracker.entity.Category;
import ro.expensestracker.entity.Expense;

import java.math.BigDecimal;
import java.util.List;

public class UserDto {

    private Long id;
    @NotEmpty(message = "You have to enter a username!")
    private String username;
    @Email(message = "Invalid email!")
    private String email;
    @NotEmpty(message = "You have to enter a password!")
    private String password;
    @Positive(message = "Budget must be positive")
    private BigDecimal budget;
    private String currency;
    private List<Expense> expenses;

    private List<Category> categories;

    public UserDto(Long id, String username, String email, String password, BigDecimal budget, String currency, List<Expense> expenses, List<Category> categories) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.budget = budget;
        this.currency = currency;
        this.expenses = expenses;
        this.categories = categories;
    }

    public UserDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
