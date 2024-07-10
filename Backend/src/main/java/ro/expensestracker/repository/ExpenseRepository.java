package ro.expensestracker.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.expensestracker.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Expense e WHERE e.category = ?1")
    void deleteByCategoryName(String categoryName);
}
