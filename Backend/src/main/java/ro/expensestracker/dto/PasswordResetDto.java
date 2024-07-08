package ro.expensestracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class PasswordResetDto {
    @Email(message = "Invalid email!")
    private String email;
    @NotEmpty(message = "Invalid password!")
    private String password;

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
}