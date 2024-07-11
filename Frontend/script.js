/* ------------------------------------------------------------------------------------ */

/* Constructors */

/* ------------------------------------------------------------------------------------ */

function User(id, name, expenses, budget, currency, categories) {
    this.id = id;
    this.name = name;
    this.expenses = expenses;
    this.budget = budget;
    this.currency = currency;
    this.categories = categories;
}

function Expense(id, category, sum, date) {
    this.id = id;
    this.category = category;
    this.sum = sum;
    this.date = date;
}

function Category(id, name) {
    this.id = id;
    this.name = name;
}



/* ------------------------------------------------------------------------------------ */

/* Elements needed in the page */

/* ------------------------------------------------------------------------------------ */

let spanUsername = document.getElementById("span-username");
let spanBudgetValue = document.getElementById('span-budget-value');
/* Statistics and categories */
let statisticsProgress = document.querySelectorAll('.progress');
let statisticsAmount = document.querySelectorAll('.statistics-amount');
let statisticsCategory = document.querySelectorAll('.statistics-category-name');
let spanPeriodStatistics = document.getElementById("span-period");
let divStatisticsPercentage = document.getElementById('div-statistics');
let maxWidthProgress = 400;
let pieChart;
let canvasPieChart = document.getElementById('canvas-pie-chart');
let divPieChart = document.getElementById('div-pie-chart');
/* Total money spent in statistics */
let totalMoneySpent = document.getElementById("span-total");
/* Middle section */
let divAddNewExpense = document.getElementById('div-add-new-expense');
let divGroupStatistics = document.getElementById('div-group-statistics');
let divGroupMiddleSections = document.getElementById('div-group-middle-sections');
let errorMessageSet = false;
/* Change currency */
let buttonChangeCurrency = document.getElementById('button-change-currency');
let buttonChangeCurrencyClicked = false;
let buttonCurrencies = document.querySelectorAll('.button-select-currency');
let oldCurrency;
let divCurrencyOptions = document.getElementById('div-currency-options');
/* Change budget */
let buttonChangeBudget = document.getElementById('button-change-budget');
let spanBudgetText = document.getElementById('span-budget-text');
let buttonChangeBudgetClicked = false;
let oldBudgetValue = 0;
let newBudgetValue = 0;
/* Add new category */
let categoryList = document.getElementById('form-input-category');
let buttonAddCategory = document.getElementById('button-add-new-category');
let buttonAddCategoryClicked = false;
let divAddNewCategory = document.createElement('div');
let spanAddNewCategory = document.createElement('span');
let formAddNewCategory = document.createElement('form');
let inputNewCategory = document.createElement('input');
let buttonAddNewCategory = document.createElement('button');
/* Add new expense */
let formExpense = document.getElementById('form-expense');
let spanInsufficientFunds = document.createElement('span');
/* Button see expenses */
let buttonSeeExpenses = document.getElementById('button-expenses');
let divExpenses = document.createElement('div');
let titleExpensesCategories = document.createElement('span');
/* Button see categories */
let buttonSeeCategories = document.getElementById('button-categories');
let divCategories = document.createElement('div');
/* See expenses by period */
let dayClicked = false;
let weekClicked = false;
let monthClicked = false;
let yearClicked = false;
/* TOP BUTTONS */
let buttonDay = document.getElementById("button-day");
let buttonWeek = document.getElementById("button-week");
let buttonMonth = document.getElementById("button-month");
let buttonYear = document.getElementById("button-year");



/* ------------------------------------------------------------------------------------ */

/* Fetch user data from database */

/* ------------------------------------------------------------------------------------ */

let token = localStorage.getItem("accessToken");
let userData = null;
let user;

let numberOfCategories;

let currency;
let currencyHTML;

fetchUserData();
userData = localStorage.getItem("userData");

if (userData != null) {
    user = new User();
    user = JSON.parse(userData);
    spanUsername.innerHTML = user.name;
    spanBudgetValue.innerHTML = user.budget;
    currency = user.currency;


    numberOfCategories = user.categories.length;

    /* Categories */
    for (let i = 0; i < numberOfCategories; i++) {
        createNewCategory(user.categories[i].name);
    }

    /* Currency */
    currencyHTML = document.querySelectorAll('.currency');
    currencyHTML.forEach(function (currency1) {
        currency1.innerText = currency;
    });

    document.addEventListener('DOMContentLoaded', function () {
        buttonDay.click();
    });
}



/* ------------------------------------------------------------------------------------ */

/* Home button */

/* ------------------------------------------------------------------------------------ */

let buttonHome = document.getElementById('button-home');
buttonHome.addEventListener("click", function () {
    buttonHome.click();
    dayClicked = false;
    buttonDay.click();

    divAddNewExpense.style.display = "block";
    divGroupStatistics.style.display = "flex";

    /* Add new category */
    formAddNewCategory.reset();
    buttonAddCategoryClicked = false;
    divAddNewCategory.style.display = "none";


    /* See expenses / categories */
    titleExpensesCategories.style.display = "none";
    divExpenses.style.display = "none";
    divCategories.style.display = "none";
});



/* ------------------------------------------------------------------------------------ */

/* See expenses */

/* ------------------------------------------------------------------------------------ */

buttonSeeExpenses.addEventListener('click', function () {

    divExpenses.style.display = "flex";
    titleExpensesCategories.style.display = "block";

    divGroupStatistics.style.display = "none";
    divAddNewExpense.style.display = "none";

    divCategories.style.display = "none";

    formAddNewCategory.reset();
    buttonAddCategoryClicked = false;
    divAddNewCategory.style.display = "none";

    createDivExpenses();
    createExpense();
});

function createDivExpenses() {
    titleExpensesCategories.innerHTML = "Expenses";

    titleExpensesCategories.classList.add('span-title-expenses');
    divGroupMiddleSections.appendChild(titleExpensesCategories);

    divExpenses.classList.add('div-expenses');
    divGroupMiddleSections.appendChild(divExpenses);
}

function createExpense() {
    if (user.expenses.length === 0) {
        titleExpensesCategories.innerHTML = "You don't have expenses registered yet!";
    }
    divExpenses.innerHTML = '';

    // Create the header
    let header = document.createElement('div');
    header.classList.add('expense-card', 'expense-header');

    let headerCategory = document.createElement('div');
    headerCategory.textContent = 'Category';
    headerCategory.classList.add('expense-category');

    let headerSum = document.createElement('div');
    headerSum.textContent = 'Sum';
    headerSum.classList.add('expense-sum');

    let headerDate = document.createElement('div');
    headerDate.textContent = 'Date';
    headerDate.classList.add('expense-date');

    let headerAction = document.createElement('div');
    headerAction.textContent = 'Action';
    headerAction.classList.add('expense-action');

    header.appendChild(headerCategory);
    header.appendChild(headerSum);
    header.appendChild(headerDate);
    header.appendChild(headerAction);

    divExpenses.appendChild(header);

    user.expenses.reverse().forEach(expense => {
        let card = document.createElement('div');
        card.classList.add('expense-card');

        let category = document.createElement('div');
        category.textContent = `${expense.category}`;
        category.classList.add('expense-category-see-expenses');

        let sum = document.createElement('div');
        sum.textContent = `${expense.sum.toFixed(2)}`;
        sum.classList.add('expense-sum-see-expenses');

        let date = document.createElement('div');
        date.textContent = `${expense.date}`;
        date.classList.add('expense-date-see-expenses');

        let action = document.createElement('div');
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteExpense(expense.id);
        });
        action.appendChild(deleteButton);
        action.classList.add('expense-action-see-expenses');

        card.appendChild(category);
        card.appendChild(sum);
        card.appendChild(date);
        card.appendChild(action);

        divExpenses.appendChild(card);
    });
}

function deleteExpense(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteExpenseFromDatabase(id);
            user.expenses = user.expenses.filter(exp => exp.id !== id);
            createExpense();
            dayClicked = false;
            buttonDay.click();
            Swal.fire(
                'Deleted!',
                'Your expense has been deleted.',
                'success'
            );
        }
    });
}



/* ------------------------------------------------------------------------------------ */

/* See categories */

/* ------------------------------------------------------------------------------------ */

buttonSeeCategories.addEventListener('click', function () {

    titleExpensesCategories.style.display = "block";
    divCategories.style.display = "block";

    divGroupStatistics.style.display = "none";
    divAddNewExpense.style.display = "none";

    divExpenses.style.display = "none";

    formAddNewCategory.reset();
    buttonAddCategoryClicked = false;
    divAddNewCategory.style.display = "none";

    createDivCategories();
    createCategory();
});

function createDivCategories() {
    titleExpensesCategories.innerHTML = "Categories";

    titleExpensesCategories.classList.add('span-title-categories');
    divGroupMiddleSections.appendChild(titleExpensesCategories);

    divCategories.classList.add('div-categories');
    divGroupMiddleSections.appendChild(divCategories);
}

function createCategory() {
    if (user.categories.length === 0) {
        titleExpensesCategories.innerHTML = "You don't have categories registered yet!";
    }
    divCategories.innerHTML = '';

    let header = document.createElement('div');
    header.classList.add('category-card', 'category-header');

    let nameHeader = document.createElement('div');
    nameHeader.textContent = 'Name';
    nameHeader.classList.add('category-name-see-categories');

    let actionHeader = document.createElement('div');
    actionHeader.textContent = 'Action';
    actionHeader.classList.add('category-action');

    header.appendChild(nameHeader);
    header.appendChild(actionHeader);

    divCategories.appendChild(header);

    user.categories.forEach(category => {
        let card = document.createElement('div');
        card.classList.add('category-card');

        let name = document.createElement('div');
        name.textContent = `${category.name}`;
        name.classList.add('category-name-see-categories');

        let action = document.createElement('div');
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            deleteCategory(category.id, category.name);
        });
        action.appendChild(deleteButton);
        action.classList.add('category-action');

        card.appendChild(name);
        card.appendChild(action);

        divCategories.appendChild(card);
    });
}

function deleteCategory(id, name) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let divIndividualStatistics = document.querySelectorAll(".div-individual-statistics");
            let categoryOption = document.querySelectorAll(".form-input-category-option");

            for (let i = 0; i < numberOfCategories; i++) {
                divIndividualStatistics[i].remove();
                categoryOption[i + 1].remove();
            }
            numberOfCategories--;

            user.categories = user.categories.filter(cat => cat.name !== name);
            user.expenses = user.expenses.filter(exp => exp.category !== name);

            for (let i = 0; i < numberOfCategories; i++) {
                createNewCategory(user.categories[i].name);
            }
            createCategory();
            deleteCategoryFromDatabase(id);
            dayClicked = false;
            buttonDay.click();
            Swal.fire(
                'Deleted!',
                'Your category has been deleted.',
                'success'
            );
        }
    });
}



/* ------------------------------------------------------------------------------------ */

/* Change currency functionality */

/* ------------------------------------------------------------------------------------ */

buttonChangeCurrency.addEventListener("click", function () {
    if (!buttonChangeCurrencyClicked) {
        buttonChangeCurrencyClicked = true;
        oldCurrency = currency;
        divCurrencyOptions.style = "display: flex; flex-direction: column;";
        buttonChangeCurrency.style.border = "1px solid white";
    }
    else {
        buttonChangeCurrencyClicked = false;
        divCurrencyOptions.style = "display: none";
        buttonChangeCurrency.style = "";
        buttonChangeCurrency.classList.add('vertical-navbar-button');
    }
});

buttonCurrencies[0].addEventListener("click", async function () {
    divCurrencyOptions.style = "display: none;";
    buttonChangeCurrencyClicked = false;
    if (oldCurrency != "RON") {
        currency = "RON";
        currencyHTML.forEach(function (currency1) {
            currency1.innerText = currency;
        });
        let rate;
        if (oldCurrency === "$") {
            rate = await fetchExchangeRate("USD", "RON");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;
            });
        }
        if (oldCurrency === "€") {
            rate = await fetchExchangeRate("EUR", "RON");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;
            });
        }
        dayClicked = false;
        buttonDay.click();
        createExpense();
        oldCurrency = currency;
        user.currency = currency;
        user.budget = spanBudgetValue.innerText;
        saveCurrencyToDatabase(user.currency);
        saveAllExpensesInDatabase(user.expenses);
    }
    buttonChangeCurrency.style = "";
    buttonChangeCurrency.classList.add('vertical-navbar-button');
});

buttonCurrencies[1].addEventListener("click", async function () {
    divCurrencyOptions.style = "display: none;";
    buttonChangeCurrencyClicked = false;
    if (oldCurrency != "$") {
        currency = "$";
        currencyHTML.forEach(function (currency1) {
            currency1.innerText = currency;
        });
        let rate;
        if (oldCurrency === "RON") {
            rate = await fetchExchangeRate("RON", "USD");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;

            });
        }
        if (oldCurrency === "€") {
            rate = await fetchExchangeRate("EUR", "USD");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;
            });
        }
        dayClicked = false;
        buttonDay.click();
        createExpense();
        oldCurrency = currency;
        user.currency = currency;
        user.budget = spanBudgetValue.innerText;
        saveCurrencyToDatabase(user.currency);
        saveAllExpensesInDatabase(user.expenses);
    }
    buttonChangeCurrency.style = "";
    buttonChangeCurrency.classList.add('vertical-navbar-button');
});

buttonCurrencies[2].addEventListener("click", async function () {
    divCurrencyOptions.style = "display: none;";
    buttonChangeCurrencyClicked = false;
    if (oldCurrency != "€") {
        currency = "€";
        currencyHTML.forEach(function (currency1) {
            currency1.innerText = currency;
        });
        let rate;
        if (oldCurrency === "RON") {
            rate = await fetchExchangeRate("RON", "EUR");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;
            });
        }
        if (oldCurrency === "$") {
            rate = await fetchExchangeRate("USD", "EUR");
            let newValue = parseFloat(spanBudgetValue.innerText) * rate;
            spanBudgetValue.innerText = newValue.toFixed(2);
            user.expenses.forEach(function (expense) {
                expense.sum = parseFloat(expense.sum) * rate;
            });
        }
        dayClicked = false;
        buttonDay.click();
        createExpense();
        oldCurrency = currency;
        user.currency = currency;
        user.budget = spanBudgetValue.innerText;
        saveCurrencyToDatabase(user.currency);
        saveAllExpensesInDatabase(user.expenses);
    }
    buttonChangeCurrency.style = "";
    buttonChangeCurrency.classList.add('vertical-navbar-button');
});



/* ------------------------------------------------------------------------------------ */

/* Change budget functionality */

/* ------------------------------------------------------------------------------------ */

buttonChangeBudget.addEventListener("click", function () {

    if (!buttonChangeBudgetClicked) {
        buttonChangeBudgetClicked = true;

        oldBudgetValue = parseFloat(spanBudgetValue.innerText);

        // Append "editable" styles
        buttonChangeBudget.style = "color: palegreen; font-weight: bold; border: 1px solid white;";
        buttonChangeBudget.innerHTML = "<i class='fa fa-usd' style='margin-right: 13px; margin-left: 5px;'></i>Save Budget";

        spanBudgetText.innerHTML = "Edit Budget: ";

        spanBudgetValue.style = "color: green; border: 0.25px solid rgb(28, 48, 162); border-radius: 3px";
        spanBudgetValue.contentEditable = true;

        spanBudgetValue.addEventListener("keydown", function (event) {

            // Configurate spanBudgetValue to accept only numbers and needed characters
            let keyCode = event.code;

            let isDigit = (keyCode.startsWith("Digit"));
            let isEnter = (keyCode === "Enter");
            let isBackspace = (keyCode === "Backspace");
            let isArrowLeft = (keyCode === "ArrowLeft");
            let isArrowRight = (keyCode === "ArrowRight");
            let isPeriod = (keyCode === "Period");

            if (isEnter) {
                event.preventDefault();
            }
            if (!isDigit && !isBackspace && !isArrowLeft && !isArrowRight && !isPeriod) {
                event.preventDefault();
            }
            if (spanBudgetValue.innerText.length > 5 && !isBackspace && !isArrowLeft && !isArrowRight && !isPeriod) {
                if (!spanBudgetValue.innerText.includes(".")) {
                    event.preventDefault();
                }
                // Add 3 more characters for ".00"
                else if (spanBudgetValue.innerText.length > 8) {
                    event.preventDefault();
                }
            }

            if (isPeriod && spanBudgetValue.innerText.includes(".")) {
                event.preventDefault();
            }
        });
    }
    else {
        buttonChangeBudgetClicked = false;

        newBudgetValue = spanBudgetValue.innerText;
        if (newBudgetValue === "" || parseFloat(newBudgetValue) === 0
            || parseFloat(oldBudgetValue) === parseFloat(newBudgetValue)
            || newBudgetValue[newBudgetValue.length - 1] === "."
            || newBudgetValue[0] === ".") {
            spanBudgetValue.innerText = oldBudgetValue;
        }
        else {
            spanBudgetValue.innerText = newBudgetValue;
            saveBudgetValueInDatabase(newBudgetValue);
        }

        // Append normal styles
        buttonChangeBudget.style = "";
        buttonChangeBudget.innerHTML = "<i class='fa fa-usd'style='margin-right: 13px; margin-left: 5px;'></i>Change Budget";
        buttonChangeBudget.classList.add('vertical-navbar-button');

        spanBudgetText.innerHTML = "Budget: ";

        spanBudgetValue.style = "";
        spanBudgetValue.classList.add("span-budget-value");

        spanBudgetValue.contentEditable = false;
    }
})



/* ------------------------------------------------------------------------------------ */

/* Add new category functionality */

/* ------------------------------------------------------------------------------------ */


/* Create the div where user have to enter a new category */
buttonAddCategory.addEventListener("click", function () {
    if (!buttonAddCategoryClicked) {

        buttonAddCategoryClicked = true;
        divGroupStatistics.style.display = "flex";

        // Animation for statistics
        dayClicked = false;
        buttonDay.click();

        /* Add new expense */
        divAddNewExpense.style.display = 'none';

        /* See expenses / categories */
        divCategories.style.display = 'none';
        divExpenses.style.display = 'none';
        titleExpensesCategories.style.display = 'none';

        createDivAddNewCategory();
    }
});

function createDivAddNewCategory() {
    divAddNewCategory.classList.add('div-add-new-category');
    divAddNewCategory.style = "display: flex;";

    spanAddNewCategory.innerText = "Add New Category";
    spanAddNewCategory.classList.add('span-add-new-category');
    divAddNewCategory.appendChild(spanAddNewCategory);

    inputNewCategory.classList.add('input-category');
    inputNewCategory.placeholder = "Food";
    inputNewCategory.required = true;
    inputNewCategory.type = "text";
    inputNewCategory.maxLength = 15;
    inputNewCategory.name = "category";
    inputNewCategory.style = "margin-top: 10px;"
    formAddNewCategory.appendChild(inputNewCategory);

    buttonAddNewCategory.classList.add('button-add-new-category');
    buttonAddCategory.type = "submit";
    buttonAddNewCategory.innerText = "+";
    formAddNewCategory.appendChild(buttonAddNewCategory);

    formAddNewCategory.style = "display: flex; flex-direction: column;";
    divAddNewCategory.appendChild(formAddNewCategory);

    divGroupMiddleSections.insertBefore(divAddNewCategory, divGroupStatistics);
}


/* Return to home and create a new category */

formAddNewCategory.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ok means this category doesn't exist
    let ok = true;

    for (let i = 0; i < numberOfCategories; i++) {
        if (user.categories[i].name == inputNewCategory.value) {
            createCategoryExistsErrorMessage();
            ok = false;
            i = numberOfCategories;
        }
    }

    if (ok) {
        divAddNewCategory.style.display = "none";
        divAddNewExpense.style.display = "block";

        numberOfCategories++;
        // Save the new category in the database
        try {
            const responseData = await saveCategoryInDatabase(inputNewCategory.value);
            user.categories.push(new Category(responseData.id, inputNewCategory.value));
        } catch (error) {
            console.error('Error adding new category:', error);
        }
        createNewCategory(inputNewCategory.value);
        buttonAddCategoryClicked = false;
        formAddNewCategory.reset();

        dayClicked = false;
        buttonDay.click();
    }
});


/* Add the new category in statistics and category list divs */
function createNewCategory(value) {

    // Statistics
    let divNewCategoryInStatistics = document.createElement('div');
    divNewCategoryInStatistics.classList.add('div-individual-statistics');

    let divCategoryDetails = document.createElement('div');
    divCategoryDetails.classList.add("div-statistics-category-details");

    let divCategoryName = document.createElement('div');
    divCategoryName.classList.add('statistics-category-name');
    divCategoryName.innerText = value;
    divCategoryDetails.appendChild(divCategoryName);

    let divGroupAmountAndCurrency = document.createElement('div');

    let spanCategoryAmount = document.createElement('span');
    spanCategoryAmount.classList.add('statistics-amount');
    spanCategoryAmount.innerText = "0.00";
    divGroupAmountAndCurrency.appendChild(spanCategoryAmount);

    let spanCurrency = document.createElement('span');
    spanCurrency.classList.add('currency');
    spanCurrency.innerText = currency;
    divGroupAmountAndCurrency.appendChild(spanCurrency);

    divCategoryDetails.appendChild(divGroupAmountAndCurrency);
    divNewCategoryInStatistics.appendChild(divCategoryDetails);

    let divProgressBox = document.createElement('div');
    divProgressBox.classList.add('progress-box');
    divNewCategoryInStatistics.appendChild(divProgressBox);

    let divProgress = document.createElement('div');
    divProgress.classList.add('progress');
    divProgress.style.width = "0px";
    divProgress.innerHTML = "0%";
    divProgressBox.appendChild(divProgress);

    divStatisticsPercentage.insertBefore(divNewCategoryInStatistics,
        document.querySelector('.div-statistics-total'));

    currencyHTML = document.querySelectorAll('.currency');
    statisticsCategory = document.querySelectorAll('.statistics-category-name');
    statisticsAmount = document.querySelectorAll('.statistics-amount');
    statisticsProgress = document.querySelectorAll('.progress');

    /* Category List (from add new expense) */
    let option = document.createElement('option');
    option.classList.add('form-input-category-option');
    option.innerText = value;

    categoryList.appendChild(option);
}


/* Wrong input function */
function createCategoryExistsErrorMessage() {
    if (!errorMessageSet) {
        errorMessageSet = true;

        let spanCategoryExists = document.createElement('span');
        spanCategoryExists.classList.add('span-category-exists');
        spanCategoryExists.innerText = "This category already exists!";
        formAddNewCategory.insertBefore(spanCategoryExists, formAddNewCategory.firstChild);

        setTimeout(function () {
            spanCategoryExists.remove();
            errorMessageSet = false;
        }, 5000);
    }
}



/* ------------------------------------------------------------------------------------ */

/* Add new expense functionality */

/* ------------------------------------------------------------------------------------ */

document.getElementById("form-expense").addEventListener("submit", function (event) {
    event.preventDefault();
    let amount = document.getElementById("form-input-amount").value;
    let category = document.getElementById("form-input-category").value;
    let budgetValue = parseFloat(spanBudgetValue.innerText) - parseFloat(amount);

    if (budgetValue < 0) {
        if (!errorMessageSet) {
            errorMessageSet = true;

            spanInsufficientFunds.classList.add('span-insufficient-funds');
            spanInsufficientFunds.innerText = "Insufficent Funds!";
            formExpense.insertBefore(spanInsufficientFunds, formExpense.firstChild);
            setTimeout(function () {
                spanInsufficientFunds.remove();
                errorMessageSet = false;
            }, 5000);
        }
    }
    else {
        setNewExpenseToList(amount, category);
        if (spanInsufficientFunds != undefined) {
            spanInsufficientFunds.remove();
        }
        saveBudgetValueInDatabase(budgetValue);
        user.budget = budgetValue;
        spanBudgetValue.innerText = user.budget.toFixed(2);

        dayClicked = false;
        buttonDay.click();
        document.getElementById("form-expense").reset();
    }
});

async function setNewExpenseToList(amount, category) {
    try {
        let newExpense = new Expense(0, category, parseFloat(amount), new Date().toISOString().split('T')[0]);
        const responseData = await saveExpenseInDatabase(newExpense, amount);

        const newExpenseFromServer = new Expense(responseData.id, category, parseFloat(amount), new Date().toISOString().split('T')[0]);
        user.expenses.push(newExpenseFromServer);
        dayClicked = false;
        buttonDay.click();
    } catch (error) {
        console.error('Error adding new expense:', error);
    }
}



/* ------------------------------------------------------------------------------------ */

/* See expenses by period functionality */

/* ------------------------------------------------------------------------------------ */

/* Button onclick functions */
buttonDay.addEventListener("click", function () {
    if (!dayClicked) {
        buttonDay.classList.add('button-active');
        buttonWeek.classList.remove('button-active');
        buttonMonth.classList.remove('button-active');
        buttonYear.classList.remove('button-active');
        dayClicked = true;
        weekClicked = false;
        monthClicked = false;
        yearClicked = false;
        spanPeriodStatistics.innerHTML = "Today";
        let todayExpenses = getTodayExpenses(user.expenses);
        populateHistory(todayExpenses, 0);
        calculateStatistics(todayExpenses);
    }
});

buttonWeek.addEventListener("click", function () {
    if (!weekClicked) {
        buttonWeek.classList.add('button-active');
        buttonMonth.classList.remove('button-active');
        buttonYear.classList.remove('button-active');
        buttonDay.classList.remove('button-active');
        weekClicked = true;
        dayClicked = false;
        monthClicked = false;
        yearClicked = false;
        spanPeriodStatistics.innerHTML = "This Week";
        let weekExpenses = getWeekExpenses(user.expenses);
        populateHistory(weekExpenses, 1);
        calculateStatistics(weekExpenses);
    }
});

buttonMonth.addEventListener("click", function () {
    if (!monthClicked) {
        buttonMonth.classList.add('button-active');
        buttonWeek.classList.remove('button-active');
        buttonYear.classList.remove('button-active');
        buttonDay.classList.remove('button-active');
        monthClicked = true;
        dayClicked = false;
        weekClicked = false;
        yearClicked = false;
        spanPeriodStatistics.innerHTML = "This Month";
        let monthExpenses = getMonthExpenses(user.expenses);
        populateHistory(monthExpenses, 2);
        calculateStatistics(monthExpenses);

    }
});

buttonYear.addEventListener("click", function () {
    if (!yearClicked) {
        buttonYear.classList.add('button-active');
        buttonWeek.classList.remove('button-active');
        buttonMonth.classList.remove('button-active');
        buttonDay.classList.remove('button-active');
        yearClicked = true;
        dayClicked = false;
        weekClicked = false;
        monthClicked = false;
        spanPeriodStatistics.innerHTML = "This Year";
        let yearExpenses = getYearExpenses(user.expenses);
        populateHistory(yearExpenses, 3);
        calculateStatistics(yearExpenses);
    }
});


function populateHistory(expenses, period) {
    let divHistoryList = document.querySelector('.div-history-list');
    divHistoryList.innerHTML = '';

    let periodText = document.querySelector('.span-history-date');

    let divHistoryItem = document.createElement('div');
    divHistoryItem.classList.add('div-history-list');

    let dateSpan = document.createElement('span');
    let today = new Date();
    switch (period) {
        case 0:
            dateSpan.classList.add('history-period');
            dateSpan.textContent = new Date().toLocaleDateString();
            divHistoryItem.appendChild(dateSpan);

            periodText.innerHTML = "Today";
            break;
        case 1:
            dateSpan.classList.add('history-period');
            let lastWeek = new Date(today.setDate(today.getDate() - 6));
            dateSpan.textContent = lastWeek.toLocaleDateString() + " - " + new Date().toLocaleDateString();
            divHistoryItem.appendChild(dateSpan);

            periodText.innerHTML = "This week";
            break;
        case 2:
            dateSpan.classList.add('history-period');
            let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            dateSpan.textContent = firstDayOfMonth.toLocaleDateString() + " - " + lastDayOfMonth.toLocaleDateString();
            divHistoryItem.appendChild(dateSpan);

            periodText.innerHTML = "This month";
            break;
        case 3:
            dateSpan.classList.add('history-period');
            let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            let lastDayOfYear = new Date(today.getFullYear(), 11, 31);
            dateSpan.textContent = firstDayOfYear.toLocaleDateString() + " - " + lastDayOfYear.toLocaleDateString();
            divHistoryItem.appendChild(dateSpan);

            periodText.innerHTML = "This year";
            break;
        default:
            console.log("Something went wrong!");
    }

    divHistoryList.appendChild(divHistoryItem);

    expenses.reverse().forEach(function (expense) {
        let divHistoryItem = document.createElement('div');
        divHistoryItem.classList.add('div-history-item');

        let categorySpan = document.createElement('span');
        categorySpan.textContent = expense.category;
        categorySpan.classList.add('category-span');

        let amountCurrencyContainer = document.createElement('div');
        amountCurrencyContainer.classList.add('amount-currency-container');

        let amountSpan = document.createElement('span');
        amountSpan.textContent = (expense.sum).toFixed(2) + ' ';
        amountSpan.classList.add('history-item-component');

        let currencySpan = document.createElement('span');
        currencySpan.classList.add('currency');
        currencySpan.style = "margin-left:5px";
        currencySpan.textContent = currency;

        amountCurrencyContainer.appendChild(amountSpan);
        amountCurrencyContainer.appendChild(currencySpan);

        divHistoryItem.appendChild(categorySpan);
        divHistoryItem.appendChild(amountCurrencyContainer);

        divHistoryList.appendChild(divHistoryItem);
    });
}


function calculateStatistics(expenses) {

    let categorySumVector = new Array(numberOfCategories).fill(0);
    let total = 0;


    expenses.forEach(function (expense) {
        for (let i = 0; i < numberOfCategories; i++) {
            if (expense.category === statisticsCategory[i].innerHTML) {
                categorySumVector[i] += expense.sum;

            }
        }
        total += expense.sum;
    });

    // Set total money spent and category spent
    totalMoneySpent.innerHTML = total.toFixed(2);
    for (let i = 0; i < numberOfCategories; i++) {
        statisticsAmount[i].innerHTML = categorySumVector[i].toFixed(2);
    }

    if (total === 0) {
        for (let i = 0; i < numberOfCategories; i++) {
            statisticsProgress[i].style.width = "0px";
        }
    }
    else {

        let percentage = 0;
        for (let i = 0; i < numberOfCategories; i++) {
            percentage = categorySumVector[i] / total * 100;
            if (percentage > 0 && percentage < 1) {
                percentage = 1
            }
            if (Math.round(percentage) < 6 && Math.round(percentage) > 0) {
                statisticsProgress[i].innerHTML = Math.round(percentage) + "%";
                percentage = 6;
                statisticsProgress[i].style.width = percentage.toFixed(2) / 100 * maxWidthProgress + "px";
            }
            else {
                statisticsProgress[i].innerHTML = Math.round(percentage) + "%";
                statisticsProgress[i].style.width = percentage.toFixed(2) / 100 * maxWidthProgress + "px";
            }

        }
    }
    createOrUpdateChart(categorySumVector, total);
}


function createOrUpdateChart(categorySumVector, totalMoneySpent) {
    divPieChart.style.height = (divStatisticsPercentage.clientHeight) + "px";
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }

    if (categorySumVector.length === 0) {
        divPieChart.innerHTML = "";
        let title = document.createElement("span");
        title.textContent = "Chart";
        title.classList.add("span-title-pie-chart");
        divPieChart.appendChild(title);

        let noDataToShowMessage = document.createElement("span");
        noDataToShowMessage.textContent = "No data available!";
        noDataToShowMessage.classList.add("span-no-data-to-show");
        divPieChart.appendChild(noDataToShowMessage);
        return;
    }
    else if (totalMoneySpent === 0) {
        divPieChart.innerHTML = "";
        let title = document.createElement("span");
        title.textContent = "Chart";
        title.classList.add("span-title-pie-chart");
        divPieChart.appendChild(title);

        let noDataToShowMessage = document.createElement("span");
        noDataToShowMessage.textContent = "No expenses registered!";
        noDataToShowMessage.classList.add("span-no-data-to-show");
        divPieChart.appendChild(noDataToShowMessage);
        return;
    }

    divPieChart.innerHTML = "";
    divPieChart.appendChild(canvasPieChart);

    canvasPieChart.width = divPieChart.clientWidth;
    canvasPieChart.height = divPieChart.clientHeight;

    pieChart = new Chart(canvasPieChart, {
        type: 'pie',
        data: {
            labels: Array.from(statisticsCategory).map(cat => cat.innerHTML),
            datasets: [{
                label: 'Amount',
                data: categorySumVector,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Chart',
                    color: 'rgb(28, 48, 162)',
                    font: {
                        size: 25,
                        weight: 'bold',
                        family: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'center',
                    labels: {
                        color: 'rgb(28, 48, 162)',
                        boxWidth: 40,
                        padding: 15,
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                        }
                    }
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

/* Get expenses by period */

function getTodayExpenses(expenses) {
    let today = new Date();
    today.setDate(today.getDate());
    let formattedToday = today.toISOString().split('T')[0];

    let todayExpenses = expenses.filter(function (expense) {
        return expense.date === formattedToday;
    });

    return todayExpenses;
}

function getWeekExpenses(expenses) {
    let today = new Date();
    let lastDayOfWeek = new Date(today.setDate(today.getDate()));
    let firstDayOfWeek = new Date(today.setDate(lastDayOfWeek.getDate() - 6));

    let weekExpenses = expenses.filter(function (expense) {
        let expenseDate = new Date(expense.date);
        return expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek;
    });

    return weekExpenses;
}

function getMonthExpenses(expenses) {
    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let monthExpenses = expenses.filter(function (expense) {
        let expenseDate = new Date(expense.date);
        return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth;
    });

    return monthExpenses;
}

function getYearExpenses(expenses) {
    let today = new Date();
    let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    let lastDayOfYear = new Date(today.getFullYear(), 11, 31);

    let yearExpenses = expenses.filter(function (expense) {
        let expenseDate = new Date(expense.date);
        return expenseDate >= firstDayOfYear && expenseDate <= lastDayOfYear;
    });

    return yearExpenses;
}



/* ------------------------------------------------------------------------------------ */

/* Log out button */

/* ------------------------------------------------------------------------------------ */

let buttonLogOut = document.getElementById("button-logout");
buttonLogOut.addEventListener('click', function () {
    token = null;
    localStorage.removeItem('accessToken');
    window.location.href = "../authentication/login.html"
});



/* ------------------------------------------------------------------------------------ */

/* User api calls */

/* ------------------------------------------------------------------------------------ */

async function fetchUserData() {
    try {
        const url = `http://localhost:8080/api/users/details`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            window.location.href = "../authentication/login.html";
            throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();

        userData.expenses.forEach(expenseData => {
            let expenseDate = new Date(expenseData.date);
            expenseDate.setDate(expenseDate.getDate() + 1);
            expenseData.date = expenseDate.toISOString();
        });

        let user = new User(userData.id, userData.username, [], userData.budget, userData.currency);
        let expenses = userData.expenses.map(expenseData => {
            return new Expense(expenseData.id, expenseData.category, expenseData.sum, expenseData.date.substring(0, 10));
        });
        let categories = userData.categories.map(categoryData => {
            return new Category(categoryData.id, categoryData.name);
        });
        user.expenses = expenses;
        user.categories = categories;

        localStorage.setItem("userData", JSON.stringify(user));
        console.log("User details", user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

async function saveBudgetValueInDatabase(budget) {
    try {
        const url = 'http://localhost:8080/api/users/budget';
        const response = await fetch(url, {
            method: 'PUT',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(budget)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Budget was successfully updated', data);
        } else {
            console.error('Failed to update budget:', response.status)
        }
    } catch (error) {
        console.error('Error updating budget:', error);
        throw error;
    }
}

async function saveCurrencyToDatabase(currency) {
    try {
        const url = 'http://localhost:8080/api/users/currency';
        const response = await fetch(url, {
            method: 'PUT',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(currency)
        });

        if (response.ok) {
            // save new budget in database
            saveBudgetValueInDatabase(user.budget);

            const data = await response.json();
            console.log('Currency was successfully updated:', data);
        } else {
            console.error('Failed to update currency:', response.status);
        }
    } catch (error) {
        console.error('Error updating currency:', error);
        throw error;
    }
}



/* ------------------------------------------------------------------------------------ */

/* Expense api calls */

/* ------------------------------------------------------------------------------------ */

async function saveExpenseInDatabase(newExpense, amount) {
    try {
        const url = 'http://localhost:8080/api/expenses';
        const response = await fetch(url, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: newExpense.category, sum: parseFloat(amount), date: newExpense.date, user_id: user.id })
        });

        if (response.ok) {
            const data = await response.json();

            if (data && data.id) {
                console.log("Expense was successfully saved", data)
                return data;
            } else {
                console.error('Error: Invalid data returned from server');
            }
        }
        else {
            console.error('Failed to save expense:', response.status);
        }
    } catch (error) {
        console.error('Error saving expense:', error);
        throw error;
    }
}

async function deleteExpenseFromDatabase(id) {
    const url = `http://localhost:8080/api/expenses/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            console.log('Expense was successfully deleted');
            return response;
        } else {
            console.error("Failed to delete expense:", response.status)
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
}


async function saveAllExpensesInDatabase(expenses) {
    const url = `http://localhost:8080/api/expenses`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenses),
        });
        if (response.ok) {
            return response;
        } else {
            console.error("Failed to update expenses:", response.status)
        }
    } catch (error) {
        console.error('Error updating expenses:', error);
        throw error;
    }
}


/* ------------------------------------------------------------------------------------ */

/* Category api calls */

/* ------------------------------------------------------------------------------------ */

async function saveCategoryInDatabase(category) {
    try {
        const url = 'http://localhost:8080/api/categories';
        const response = await fetch(url, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: category, userId: user.id })
        });


        if (response.ok) {
            const data = await response.json();
            console.log('Category was successfully saved', data);
            if (data && data.id) {
                return data;
            } else {
                console.error('Error: Invalid data returned from server');
            }
            dayClicked = false;
            buttonDay.click();
        } else {
            console.error('Failed to save category:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
}

async function deleteCategoryFromDatabase(id) {
    const url = `http://localhost:8080/api/categories/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            console.log('Category was successfully deleted');
            return response;
        } else {
            console.error("Failed to delete expense:", response.status)
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}



/* ------------------------------------------------------------------------------------ */

/* Exchange rates api calls */

/* ------------------------------------------------------------------------------------ */

async function fetchExchangeRate(fromCurrency, toCurrency) {
    try {
        const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to retrieve exchange rate data");
        }

        const exchangeRate = await response.json();
        return exchangeRate.rates[toCurrency];

    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        throw error;
    }
}