package ro.expensestracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ro.expensestracker.dto.ApiResponseDto;

import java.util.Optional;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(errorObj -> Optional.ofNullable(errorObj.getDefaultMessage()).orElse("Unknown validation error"))
                .findFirst()
                .orElse("Unknown validation error");

        ApiResponseDto response = new ApiResponseDto(error);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
