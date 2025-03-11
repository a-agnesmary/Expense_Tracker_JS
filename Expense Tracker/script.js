document.addEventListener("DOMContentLoaded", () => {
    const balanceElement = document.getElementById("balance");
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpenseElement = document.getElementById("total-expense");

    const form = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");

    const listPanel = document.getElementById("list-panel");
    const closePanel = document.getElementById("close-panel");
    const listTitle = document.getElementById("list-title");

    const showIncomeList = document.getElementById("show-income-list"); // btn
    const showExpenseList = document.getElementById("show-expense-list"); // btn

    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");

    let transactions = [];
    let editId = null;

    function updateTotals() {
        let totalIncome = 0;
        let totalExpense = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].type === "income") {
                totalIncome += transactions[i].amount;
            } else {
                totalExpense += transactions[i].amount;
            }
        }
        let balance = totalIncome - totalExpense;
        totalIncomeElement.textContent = `₹ ${totalIncome.toFixed(2)}`;
        totalExpenseElement.textContent = `₹ ${totalExpense.toFixed(2)}`;
        balanceElement.textContent = `₹ ${balance.toFixed(2)}`;
    }
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const type = typeInput.value;
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        if (description && amount > 0) {
            if (editId) {
                for (let i = 0; i < transactions.length; i++) {
                    if (transactions[i].id === editId) {
                        transactions[i].description = description;
                        transactions[i].amount = amount;
                        transactions[i].type = type;
                        break;
                    }
                }
                editId = null;
            } else {
                // Add new transaction
                transactions.push({ id: Date.now(), description, amount, type });
            }
            updateTotals();
            showList(type);
            form.reset(); // reset the container
        }
        
    });

    showIncomeList.addEventListener("click", () => showList("income"));
    showExpenseList.addEventListener("click", () => showList("expense"));

    function showList(type) {
        listTitle.textContent = type === "income" ? "Income List" : "Expense List";
        updateLists(type);
        listPanel.classList.add("active");
    }

    function updateLists(type) {
        transactionList.innerHTML = "";
    
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].type === type) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${transactions[i].description} - ₹${transactions[i].amount.toFixed(2)}</span>
                `;
    
                const editButton = document.createElement("button");
                editButton.textContent = "✏️";
                editButton.classList.add("edit-btn");
                editButton.addEventListener("click", () => editTransaction(transactions[i].id)); // Direct event listener
    
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "🗑️";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", () => deleteTransaction(transactions[i].id)); 
    
                li.appendChild(editButton);
                li.appendChild(deleteButton);
                transactionList.appendChild(li);
            }
        }
    }
    
    function editTransaction(id) {
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id === id) {
                descriptionInput.value = transactions[i].description;
                amountInput.value = transactions[i].amount;
                typeInput.value = transactions[i].type;
                editId = id;
                break;
            }
        }
    }

    function deleteTransaction(id) {
        let newTransactions = [];
        // id doesn't match , it will store in new transactions
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id !== id) {
                newTransactions.push(transactions[i]); 
            }
        }
        transactions = newTransactions; // Update the transactions array
        updateTotals();
        updateLists();
    }

    closePanel.addEventListener("click", () => {
        listPanel.classList.remove("active");
    });

});
