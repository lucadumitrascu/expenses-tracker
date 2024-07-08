package ro.expensestracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.expensestracker.dto.ExpenseDto;
import ro.expensestracker.entity.Expense;
import ro.expensestracker.entity.User;
import ro.expensestracker.mapper.ExpenseMapper;
import ro.expensestracker.repository.ExpenseRepository;
import ro.expensestracker.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    private final UserRepository userRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<ExpenseDto> createExpense(ExpenseDto expenseDto) {
        Expense expense = ExpenseMapper.toExpense(expenseDto);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(currentUsername);

        if (currentUserOptional.isPresent()) {
            User currentUser = currentUserOptional.get();
            expense.setUser(currentUser);
            Expense savedExpense = expenseRepository.save(expense);
            return new ResponseEntity<>(ExpenseMapper.toExpenseDto(savedExpense), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<ExpenseDto> updateExpense(Long id, ExpenseDto expenseDto) {
        expenseDto.setId(id);
        Expense expense = ExpenseMapper.toExpense(expenseDto);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> currentUserOptional = userRepository.findByUsername(currentUsername);

        if (currentUserOptional.isPresent()) {
            User currentUser = currentUserOptional.get();
            expense.setUser(currentUser);
            return new ResponseEntity<>(expenseDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<ExpenseDto> deleteExpense(Long id) {
        if (expenseRepository.findById(id).isPresent()) {
            expenseRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<String> updateAllExpenses(List<ExpenseDto> expenses) {
        for (ExpenseDto expenseDto : expenses) {
            Optional<Expense> expenseOpt = expenseRepository.findById(expenseDto.getId());
            if (expenseOpt.isPresent()) {
                Expense expense = expenseOpt.get();
                expense.setSum(expenseDto.getSum());
                expenseRepository.save(expense);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}