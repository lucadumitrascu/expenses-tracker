package ro.expensestracker.dto;

import ro.expensestracker.entity.AuthProvider;
import java.math.BigDecimal;

public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String password;
    private BigDecimal budget;
    private String currency;
    private String googleId;
    private AuthProvider authProvider;

    public UserDto() {
    }

    public UserDto(Long id, String username, String email, String password, BigDecimal budget, String currency, String googleId, AuthProvider authProvider) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.budget = budget;
        this.currency = currency;
        this.googleId = googleId;
        this.authProvider = authProvider;
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

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
}
