package ro.expensestracker.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "user_financial_details")
public class UserFinancialDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(precision = 10, scale = 2)
    private BigDecimal salary;

    @Column
    private Integer salaryDay;

    @Column
    private String currency;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    public UserFinancialDetails(Long id, BigDecimal budget, BigDecimal salary, Integer salaryDay, String currency, User user) {
        this.id = id;
        this.budget = budget;
        this.salary = salary;
        this.salaryDay = salaryDay;
        this.currency = currency;
        this.user = user;
    }

    public UserFinancialDetails() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public Integer getSalaryDay() {
        return salaryDay;
    }

    public void setSalaryDay(Integer salaryDay) {
        this.salaryDay = salaryDay;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
