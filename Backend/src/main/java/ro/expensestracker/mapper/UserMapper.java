package ro.expensestracker.mapper;

import org.springframework.stereotype.Component;
import ro.expensestracker.dto.UserDto;
import ro.expensestracker.entity.User;

@Component
public class UserMapper {

    public static User toUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.getUserFinancialDetails().setBudget(userDto.getBudget());
        user.getUserFinancialDetails().setCurrency(userDto.getCurrency());
        user.getUserFinancialDetails().setSalary(userDto.getSalary());
        user.getUserFinancialDetails().setSalaryDay(userDto.getSalaryDay());
        user.getUserAuthentication().setAuthProvider(userDto.getAuthProvider());
        user.getUserAuthentication().setGoogleId(userDto.getGoogleId());

        return user;
    }

    public static UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setBudget(user.getUserFinancialDetails().getBudget());
        userDto.setCurrency(user.getUserFinancialDetails().getCurrency());
        userDto.setSalary(user.getUserFinancialDetails().getSalary());
        userDto.setSalaryDay(user.getUserFinancialDetails().getSalaryDay());
        userDto.setAuthProvider(user.getUserAuthentication().getAuthProvider());
        userDto.setGoogleId(user.getUserAuthentication().getGoogleId());

        return userDto;
    }
}
