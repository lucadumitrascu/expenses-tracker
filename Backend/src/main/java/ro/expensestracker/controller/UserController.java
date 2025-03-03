package ro.expensestracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.expensestracker.dto.*;
import ro.expensestracker.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/details")
    public ResponseEntity<UserDto> getUserInfo() {
        return userService.getUserDetails();
    }

    @PutMapping("/user-details/username")
    public ResponseEntity<ApiResponseDto> setUsername(@RequestBody UserDto userDto) {
        return userService.setUserUsername(userDto);
    }

    @PutMapping("/financial-details")
    public ResponseEntity<ApiResponseDto> updateFinancialDetails(@RequestBody UserFinancialDetailsDto userFinancialDetailsDto) {
        return userService.updateFinancialDetails(userFinancialDetailsDto);
    }
}
