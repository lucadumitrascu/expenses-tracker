package ro.expensestracker.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.expensestracker.dto.*;
import ro.expensestracker.service.AuthService;

@RestController
@RequestMapping("/api/authentication")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDto> register(@Valid @RequestBody RegisterDto registerDto) {
        return authService.register(registerDto);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        return authService.login(loginDto);
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponseDto> googleLogin(@RequestBody GoogleLoginDto googleToken) {
        return authService.googleLogin(googleToken.getToken());
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<ApiResponseDto> forgotPassword(@RequestBody String email) {
        return authService.forgotPassword(email);
    }

    @PutMapping("/set-new-password")
    public ResponseEntity<ApiResponseDto> setNewPassword(@Valid @RequestBody PasswordResetDto passwordResetDto) {
        return authService.setNewPassword(passwordResetDto.getEmail(), passwordResetDto.getPassword());
    }
}