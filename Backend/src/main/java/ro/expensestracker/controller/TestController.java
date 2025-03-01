package ro.expensestracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.expensestracker.dto.ApiResponseDto;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<ApiResponseDto> test() {
        return new ResponseEntity<>(new ApiResponseDto("ok"), HttpStatus.OK);
    }
}
