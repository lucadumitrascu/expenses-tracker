package ro.expensestracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.expensestracker.dto.ApiResponseDto;
import ro.expensestracker.dto.LoginDto;
import ro.expensestracker.dto.RegisterDto;
import ro.expensestracker.entity.AuthProvider;
import ro.expensestracker.entity.User;
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
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenGenerator jwtTokenGenerator, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenGenerator = jwtTokenGenerator;
        this.emailService = emailService;
    }

    public ResponseEntity<ApiResponseDto> register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            return new ResponseEntity<>(new ApiResponseDto("Username is taken."), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return new ResponseEntity<>(new ApiResponseDto("Email is already in use."), HttpStatus.BAD_REQUEST);
        }

        User newUser = new User();
        newUser.setUsername(registerDto.getUsername());
        newUser.setEmail(registerDto.getEmail());
        newUser.setPassword(registerDto.getPassword());
        newUser.setAuthProvider(AuthProvider.CUSTOM);
        newUser.setGoogleId(null);
        newUser.setBudget(BigDecimal.valueOf(300.00));
        newUser.setCurrency("RON");
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        userRepository.save(newUser);
        return new ResponseEntity<>(new ApiResponseDto("Registration successful."), HttpStatus.CREATED);
    }

    public ResponseEntity<ApiResponseDto> login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenGenerator.generateToken(authentication);

            return new ResponseEntity<>(new ApiResponseDto(token), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(new ApiResponseDto("Invalid username or password."), HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<ApiResponseDto> forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            int securityCode = generateSecurityCode();
            if (!(user.getAuthProvider() == AuthProvider.GOOGLE)) {
                String subject = "Your Security Code";
                String body = "Hello " + user.getUsername() + ",\n\nYour security code is: " + securityCode;
                emailService.sendEmail(email, subject, body);
                return new ResponseEntity<>(new ApiResponseDto(String.valueOf(securityCode)), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ApiResponseDto("Password can not be changed on Google accounts."), HttpStatus.BAD_REQUEST);
            }

        } else {
            return new ResponseEntity<>(new ApiResponseDto("Email not found."), HttpStatus.NOT_FOUND);
        }
    }

    private int generateSecurityCode() {
        Random random = new Random();
        return 100000 + random.nextInt(900000);
    }


    public ResponseEntity<ApiResponseDto> setNewPassword(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return new ResponseEntity<>(new ApiResponseDto("Password changed successfully."), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponseDto("Something went wrong."), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<ApiResponseDto> googleLogin(String googleToken) {
        String url = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + googleToken;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            String responseBody = response.getBody();
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                String googleEmail = jsonNode.get("email").asText();
                String googleId = jsonNode.get("id").asText();

                Optional<User> existingUserOpt = userRepository.findByEmail(googleEmail);

                if (existingUserOpt.isPresent()) {
                    User existingUser = existingUserOpt.get();
                    if (existingUser.getGoogleId() != null && existingUser.getGoogleId().equals(googleId)) {
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                googleEmail, null, Collections.emptyList()
                        );

                        String jwt = jwtTokenGenerator.generateToken(authentication);
                        return new ResponseEntity<>(new ApiResponseDto(jwt), HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>(new ApiResponseDto("Google ID mismatch."), HttpStatus.UNAUTHORIZED);
                    }
                } else {
                    User newUser = new User();
                    newUser.setEmail(googleEmail);
                    newUser.setUsername(googleEmail.split("@")[0]);
                    newUser.setGoogleId(googleId);
                    newUser.setAuthProvider(AuthProvider.GOOGLE);
                    newUser.setPassword(null);
                    newUser.setBudget(BigDecimal.valueOf(300.00));
                    newUser.setCurrency("RON");

                    userRepository.save(newUser);

                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            googleEmail, null, Collections.emptyList()
                    );

                    String jwt = jwtTokenGenerator.generateToken(authentication);
                    return new ResponseEntity<>(new ApiResponseDto(jwt), HttpStatus.OK);
                }

            } catch (Exception e) {
                return new ResponseEntity<>(new ApiResponseDto("Error processing Google response."), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new ResponseEntity<>(new ApiResponseDto("Invalid Google token."), HttpStatus.UNAUTHORIZED);
    }
}
