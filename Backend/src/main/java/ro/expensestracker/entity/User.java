package ro.expensestracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @Column
    private String currency;

    @Column(nullable = true, unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider;

    public User(String username, String email, String password, BigDecimal budget, String currency, AuthProvider authProvider, String googleId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.budget = budget;
        this.currency = currency;
        this.authProvider = authProvider;
        this.googleId = googleId;
    }

    public User() {
    }

    public User(Long id, String username, String email, String password, BigDecimal budget, String currency, String googleId, AuthProvider authProvider) {
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

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }
}
