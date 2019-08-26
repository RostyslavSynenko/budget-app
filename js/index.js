'use strict';

class UI {
  constructor() {
    this.budgetFeedback = document.querySelector('.budget-feedback');
    this.expenseFeedback = document.querySelector('.expense-feedback');
    this.budgetInput = document.getElementById('budget-input');
    this.budgetForm = document.getElementById('budget-form');
    this.budgetAmount = document.getElementById('budget-amount');
    this.expenseAmount = document.getElementById('expense-amount');
    this.balance = document.querySelector('.balance');
    this.balanceAmount = document.getElementById('balance-amount');
    this.expenseForm = document.getElementById('expense-form');
    this.expenseInput = document.getElementById('expense-title-input');
    this.amountInput = document.getElementById('expense-amount-input');
    this.expenseList = document.getElementById('expense-list');
    this.itemList = [];
    this.itemId = 0;
    this.edit = true;
  }

  submitBudgetForm() {
      const value = this.budgetInput.value;
      
      if(value === '' || value < 0) {
        this.budgetFeedback.classList.add('show');
        setTimeout(() => {
            this.budgetFeedback.classList.remove('show');
        }, 2000);
      } else {
        this.budgetInput.value = '';

        this.budgetAmount.textContent = value;
        this.showBalance();
      }
  }

  expenseFormSubmit() {
    const title = this.expenseInput.value;
    const value = this.amountInput.value;

    if(title === '' || value === '' || value < 0) {
      this.expenseFeedback.classList.add('show');
      setTimeout(() => {
        this.expenseFeedback.classList.remove('show');
      }, 2000);
    } else {
      this.expenseInput.value = '';
      this.amountInput.value = '';

      let expense = {
        id: this.itemId,
        title,
        value: parseInt(value)
      };
      this.itemId++;
      this.itemList.push(expense);
      this.addExpense(expense);
    }

    this.edit = true;
    this.showBalance();
  }

  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;

    if(total > 0) {
      this.balance.classList.remove('negative');
      this.balance.classList.add('positive');
    } else if(total < 0) {
      this.balance.classList.remove('positive');
      this.balance.classList.add('negative');
    } else if(total === 0) {
      this.balance.classList.remove('positive', 'negative');
    }

    this.balanceAmount.textContent = total;
  }

  totalExpense() {
    const expenseList = this.itemList;
    const total = expenseList.reduce((acc, curr) => acc + curr.value, 0);

    this.expenseAmount.textContent = total;

    return total;
  }

  addExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense-item');
    div.innerHTML = `
      <h3 class="expense-title list-item">- ${expense.title}</h3>
      <h3 class="expense-value list-item">${expense.value}</h3>
      <div class="expense-item-icons list-item">
        <a href="#expense-form" class="edit-btn" data-id="${expense.id}">
          <i class="edit-icon"></i>
        </a>
        <a href="#expense-form" class="delete-btn" data-id="${expense.id}">
          <i class="delete-icon"></i>
        </a>
      </div>
    `;

    this.expenseList.append(div);
  }

  editExpense(e) {
    if(this.edit === false) {
      return;
    }

    this.edit = false;

    let expenseItem = e.target;
    let expenseId = parseInt(e.target.parentElement.dataset.id);
    const expense = this.itemList.filter(item => item.id === expenseId)[0];
    this.itemList = this.itemList.filter(item => item.id !== expenseId);

    this.expenseInput.value = expense.title;
    this.amountInput.value = parseInt(expense.value);

    while(!expenseItem.classList.contains('expense-item')) {
      expenseItem = expenseItem.parentElement;
    }

    expenseItem.remove();

    this.showBalance();
  }

  deleteExpense(e) {
    let expenseItem = e.target;
    let expenseId = parseInt(e.target.parentElement.dataset.id);
    this.itemList = this.itemList.filter(item => item.id !== expenseId);

    while(!expenseItem.classList.contains('expense-item')) {
      expenseItem = expenseItem.parentElement;
    }

    expenseItem.remove();
    this.showBalance();
  }

  showExpense(expense) {
    
  }
}

function eventListeners() {
    const ui = new UI();

    const budgetForm = ui.budgetForm;
    const expenseForm = ui.expenseForm;
    const expenseList = ui.expenseList;

    budgetForm.addEventListener('submit', e => {
        e.preventDefault();
        ui.submitBudgetForm();
    });
    expenseForm.addEventListener('submit', e => {
        e.preventDefault();
        ui.expenseFormSubmit();
    });
    expenseList.addEventListener('click', e => {
      if(e.target.parentElement.classList.contains('edit-btn')) {
        ui.editExpense(e);
      } else if(e.target.parentElement.classList.contains('delete-btn')) {
        ui.deleteExpense(e);
      }
    });
}

document.addEventListener('DOMContentLoaded', eventListeners);
