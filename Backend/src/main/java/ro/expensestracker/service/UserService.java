package ro.expensestracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.expensestracker.dto.UserDto;
import ro.expensestracker.entity.User;
import ro.expensestracker.mapper.UserMapper;
import ro.expensestracker.repository.UserRepository;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get user details for current authenticated user
    public ResponseEntity<UserDto> getUserDetails() {
        User user = getAuthenticatedUser();
        if (user != null) {
            UserDto userDto = UserMapper.toUserDto(user);
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<BigDecimal> updateUserBudget(BigDecimal budget) {
        User user = getAuthenticatedUser();
        if (user != null) {
            user.setBudget(budget);
            userRepository.save(user);
            return new ResponseEntity<>(budget, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(budget, HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<String> updateUserCurrency(String currency) {
        User user = getAuthenticatedUser();
        if (user != null) {
            user.setCurrency(currency.replace("\"", ""));
            userRepository.save(user);
            return new ResponseEntity<>(currency, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(currency, HttpStatus.NOT_FOUND);
        }
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOptional = userRepository.findByUsername(authentication.getName());
        return userOptional.orElse(null);
    }
}