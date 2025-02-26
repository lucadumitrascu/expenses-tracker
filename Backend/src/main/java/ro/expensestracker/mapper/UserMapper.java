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
        user.setBudget(userDto.getBudget());
        user.setCurrency(userDto.getCurrency());

        return user;
    }

    public static UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setBudget(user.getBudget());
        userDto.setCurrency(user.getCurrency());

        return userDto;
    }
}
