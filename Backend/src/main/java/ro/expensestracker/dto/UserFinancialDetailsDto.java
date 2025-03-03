package ro.expensestracker.dto;

import java.math.BigDecimal;

public class UserFinancialDetailsDto {

    private BigDecimal budget;
    private String currency;
    private BigDecimal salary;
    private Integer salaryDay;

    public UserFinancialDetailsDto(BigDecimal budget, String currency, BigDecimal salary, Integer salaryDay) {
        this.budget = budget;
        this.currency = currency;
        this.salary = salary;
        this.salaryDay = salaryDay;
    }

    public UserFinancialDetailsDto() {
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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
}
