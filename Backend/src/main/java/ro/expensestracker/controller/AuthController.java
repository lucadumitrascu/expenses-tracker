package ro.expensestracker.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ro.expensestracker.dto.AuthResponseDto;
import ro.expensestracker.dto.PasswordResetDto;
import ro.expensestracker.dto.UserDto;
import ro.expensestracker.service.AuthService;

@RestController
@RequestMapping("/api/authentication")
public class AuthController {

    AuthService authService;

    @Autowired
    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserDto userDto) {
        return authService.register(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserDto userDto) {
        return authService.login(userDto);
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        return authService.forgotPassword(email);
    }

    @PutMapping("/set-new-password")
    public ResponseEntity<String> setNewPassword(@RequestBody PasswordResetDto passwordResetDto) {
        return authService.setNewPassword(passwordResetDto.getEmail(), passwordResetDto.getPassword());
    }
}