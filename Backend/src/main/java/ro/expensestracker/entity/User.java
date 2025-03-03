package ro.expensestracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserAuthentication userAuthentication;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserFinancialDetails userFinancialDetails;

    public User(UserFinancialDetails userFinancialDetails, UserAuthentication userAuthentication, String password, String email, String username, Long id) {
        this.userFinancialDetails = userFinancialDetails;
        this.userAuthentication = userAuthentication;
        this.password = password;
        this.email = email;
        this.username = username;
        this.id = id;
    }

    public User() {
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

    public UserAuthentication getUserAuthentication() {
        return userAuthentication;
    }

    public void setUserAuthentication(UserAuthentication userAuthentication) {
        this.userAuthentication = userAuthentication;
    }

    public UserFinancialDetails getUserFinancialDetails() {
        return userFinancialDetails;
    }

    public void setUserFinancialDetails(UserFinancialDetails userFinancialDetails) {
        this.userFinancialDetails = userFinancialDetails;
    }
}
