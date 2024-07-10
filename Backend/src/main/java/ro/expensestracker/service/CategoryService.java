package ro.expensestracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ro.expensestracker.dto.CategoryDto;
import ro.expensestracker.entity.Category;
import ro.expensestracker.entity.User;
import ro.expensestracker.mapper.CategoryMapper;
import ro.expensestracker.repository.CategoryRepository;
import ro.expensestracker.repository.ExpenseRepository;
import ro.expensestracker.repository.UserRepository;

import java.util.Optional;

@Service
public class CategoryService {

    CategoryRepository categoryRepository;
    ExpenseRepository expenseRepository;
    UserRepository userRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           ExpenseRepository expenseRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }


    public ResponseEntity<CategoryDto> createCategory(CategoryDto categoryDto) {
        Category category = CategoryMapper.toCategory(categoryDto);

        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        category.setUser(authenticatedUser);
        Category categoryWithUpdatedId = categoryRepository.save(category);
        categoryDto.setId(categoryWithUpdatedId.getId());

        return new ResponseEntity<>(categoryDto, HttpStatus.CREATED);
    }

    public ResponseEntity<String> deleteCategory(Long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            return new ResponseEntity<>("Category not found!", HttpStatus.NOT_FOUND);
        }

        Category category = categoryOptional.get();
        expenseRepository.deleteByCategoryName(category.getName());
        categoryRepository.deleteById(id);

        return new ResponseEntity<>("Category was deleted successfully!", HttpStatus.OK);
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return userRepository.findByUsername(authentication.getName()).orElse(null);
    }
}