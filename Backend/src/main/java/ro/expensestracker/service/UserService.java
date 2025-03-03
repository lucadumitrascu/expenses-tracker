package ro.expensestracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.expensestracker.dto.*;
import ro.expensestracker.entity.User;
import ro.expensestracker.mapper.UserMapper;
import ro.expensestracker.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<UserDto> getUserDetails() {
        ResponseEntity<ApiResponseDto> userCheckResponse = checkAuthenticatedUser();
        if (userCheckResponse != null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User user = getAuthenticatedUser();
        UserDto userDto = UserMapper.toUserDto(user);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponseDto> setUserUsername(UserDto userDto) {
        ResponseEntity<ApiResponseDto> userCheckResponse = checkAuthenticatedUser();
        if (userCheckResponse != null) {
            return userCheckResponse;
        }

        User user = getAuthenticatedUser();

        Optional<User> existingUser = userRepository.findByUsername(userDto.getUsername().trim());
        if (existingUser.isPresent()) {
            return new ResponseEntity<>(new ApiResponseDto("Username is already taken."), HttpStatus.BAD_REQUEST);
        }

        user.setUsername(userDto.getUsername().trim());
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponseDto("Username has been successfully set."), HttpStatus.OK);
    }

    public ResponseEntity<ApiResponseDto> updateFinancialDetails(UserFinancialDetailsDto userFinancialDetailsDto) {
        ResponseEntity<ApiResponseDto> userCheckResponse = checkAuthenticatedUser();
        if (userCheckResponse != null) {
            return userCheckResponse;
        }

        User user = getAuthenticatedUser();

        if (userFinancialDetailsDto.getSalary() != null) {
            user.getUserFinancialDetails().setSalary(userFinancialDetailsDto.getSalary());
        }
        if (userFinancialDetailsDto.getSalaryDay() != null) {
            user.getUserFinancialDetails().setSalaryDay(userFinancialDetailsDto.getSalaryDay());
        }
        if (userFinancialDetailsDto.getBudget() != null) {
            user.getUserFinancialDetails().setBudget(userFinancialDetailsDto.getBudget());
        }
        if (userFinancialDetailsDto.getCurrency() != null) {
            user.getUserFinancialDetails().setCurrency(userFinancialDetailsDto.getCurrency());
        }

        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponseDto("Financial details updated successfully."), HttpStatus.OK);
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userRepository.findByEmail(authentication.getName());
        return userOptional.orElse(null);
    }

    private ResponseEntity<ApiResponseDto> checkAuthenticatedUser() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return new ResponseEntity<>(new ApiResponseDto("User not found."), HttpStatus.NOT_FOUND);
        }
        return null;
    }
}
