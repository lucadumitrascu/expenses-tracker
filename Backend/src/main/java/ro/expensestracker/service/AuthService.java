package ro.expensestracker.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ro.expensestracker.dto.AuthResponseDto;
import ro.expensestracker.dto.UserDto;
import ro.expensestracker.entity.Category;
import ro.expensestracker.entity.User;
import ro.expensestracker.mapper.UserMapper;
import ro.expensestracker.repository.CategoryRepository;
import ro.expensestracker.repository.UserRepository;
import ro.expensestracker.security.JwtTokenGenerator;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenGenerator jwtTokenGenerator;
    private final CategoryRepository categoryRepository;
    private final JavaMailSender javaMailSender;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenGenerator jwtTokenGenerator,
                       CategoryRepository categoryRepository,
                       JavaMailSender javaMailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenGenerator = jwtTokenGenerator;
        this.categoryRepository = categoryRepository;
        this.javaMailSender = javaMailSender;
    }

    public ResponseEntity<String> register(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            return new ResponseEntity<>("Username is taken!", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(userDto.getEmail())) {
            return new ResponseEntity<>("Email is already in use!", HttpStatus.BAD_REQUEST);
        }

        User user = UserMapper.toUser(userDto);
        user.setBudget(BigDecimal.valueOf(300.00));
        user.setCurrency("RON");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User userFromDB = userRepository.save(user);
        createDefaultCategories(userFromDB);

        return new ResponseEntity<>("Registration successful!", HttpStatus.CREATED);
    }

    private void createDefaultCategories(User user) {
        List<Category> categories = new ArrayList<>();
        categories.add(new Category(0L, "Food", user));
        categories.add(new Category(0L, "Car", user));
        categories.add(new Category(0L, "House", user));
        categories.add(new Category(0L, "Gym", user));
        categories.add(new Category(0L, "Entertainment", user));
        categoryRepository.saveAll(categories);
    }

    public ResponseEntity<AuthResponseDto> login(UserDto userDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenGenerator.generateToken(authentication);
            return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<String> forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            int securityCode = generateSecurityCode();

            String subject = "Your Security Code";
            String body = "Hello " + user.getUsername() + ",\n\nYour security code is: " + securityCode;
            sendEmail(email, subject, body);

            return new ResponseEntity<>(securityCode + "", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Email not found!", HttpStatus.NOT_FOUND);
        }
    }

    private int generateSecurityCode() {
        Random random = new Random();
        // The number should be 6 digit length
        // This return ensures the number is between 100.000 and 999.999
        return 100000 + random.nextInt(900000);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("expensestrackerapplication@gmail.com", "Expenses Tracker");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            javaMailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    public ResponseEntity<String> setNewPassword(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return new ResponseEntity<>("Password changed successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Email not found!", HttpStatus.NOT_FOUND);
        }
    }
}