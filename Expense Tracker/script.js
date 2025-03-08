document.addEventListener("DOMContentLoaded", () => {
    const balanceElement = document.getElementById("balance");
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpenseElement = document.getElementById("total-expense");
    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");
    const listPanel = document.getElementById("list-panel");
    const closePanel = document.getElementById("close-panel");
    const listTitle = document.getElementById("list-title");
    const showIncomeList = document.getElementById("show-income-list");
    const showExpenseList = document.getElementById("show-expense-list");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");

    let transactions = [];
    let editId = null;

    function updateTotals() {
        let totalIncome = transactions.filter(t => t.type === "income")
                                      .reduce((sum, t) => sum + t.amount, 0);
        let totalExpense = transactions.filter(t => t.type === "expense")
                                       .reduce((sum, t) => sum + t.amount, 0);
        let balance = totalIncome - totalExpense;

        totalIncomeElement.textContent = `₹ ${totalIncome.toFixed(2)}`;
        totalExpenseElement.textContent = `₹ ${totalExpense.toFixed(2)}`;
        balanceElement.textContent = `₹ ${balance.toFixed(2)}`;
    }

    function showList(type) {
        listTitle.textContent = type === "income" ? "Income List" : "Expense List";
        updateLists(type);
        listPanel.classList.add("active");
    }

    closePanel.addEventListener("click", () => {
        listPanel.classList.remove("active");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const type = typeInput.value;
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());

        if (description && amount > 0) {
            if (editId) {
                // Update existing transaction
                transactions = transactions.map(t =>
                    t.id === editId ? { ...t, description, amount, type } : t
                );
                editId = null;
            } else {
                // Add new transaction
                transactions.push({ id: Date.now(), description, amount, type });
            }
            updateTotals();
            showList(type);
            form.reset();
        }
    });

    function updateLists(type) {
        transactionList.innerHTML = "";
        transactions.filter(t => t.type === type).forEach(transaction => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${transaction.description} - ₹${transaction.amount.toFixed(2)}</span>
                <button class="edit-btn" onclick="editTransaction(${transaction.id})">✏️</button>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">🗑️</button>
            `;
            transactionList.appendChild(li);
        });
    }

    window.editTransaction = (id) => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            descriptionInput.value = transaction.description;
            amountInput.value = transaction.amount;
            typeInput.value = transaction.type;
            editId = id;
        }
    };

    window.deleteTransaction = (id) => {
        transactions = transactions.filter(t => t.id !== id);
        updateTotals();
        updateLists("income");
        updateLists("expense");
    };

    showIncomeList.addEventListener("click", () => showList("income"));
    showExpenseList.addEventListener("click", () => showList("expense"));
});
