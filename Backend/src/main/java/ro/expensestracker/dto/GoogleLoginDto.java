package ro.expensestracker.dto;

import jakarta.validation.constraints.NotEmpty;

public class GoogleLoginDto {

    @NotEmpty(message = "Token is required.")
    String token;

    public GoogleLoginDto(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
