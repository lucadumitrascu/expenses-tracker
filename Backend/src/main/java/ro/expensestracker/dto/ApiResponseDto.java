package ro.expensestracker.dto;

public class ApiResponseDto {
    private String message;

    public ApiResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
