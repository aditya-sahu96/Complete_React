// 🧭 PROJECT 2 — EXPENSE TRACKER
// ---------------------------------------------------------
// Goal: Build a small app to add, list, and calculate expenses dynamically.
// We'll break the app into small components and manage state properly.

import React, { useState } from "react";

// ExpenseForm Component → handles input
function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    if (!title || !amount) return alert("All fields are required!");

    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
    };

    onAddExpense(newExpense);
    setTitle("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

// ExpenseList Component → lists expenses
function ExpenseList({ expenses }) {
  return (
    <ul>
      {expenses.map(exp => (
        <li key={exp.id}>
          {exp.title}: ₹{exp.amount}
        </li>
      ))}
    </ul>
  );
}

// ExpenseSummary Component → calculates total
function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return <h3>Total Expense: ₹{total}</h3>;
}

// Main Component
function ExpenseTrackerApp() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = expense => setExpenses(prev => [...prev, expense]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>💸 Expense Tracker</h1>
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
      <ExpenseSummary expenses={expenses} />
    </div>
  );
}

export default ExpenseTrackerApp;

// 🔍 Professional Notes:
// - Controlled form ensures inputs always follow React state.
// - Components are modular → easy for future scaling (filters, categories, etc.).
// - Proper key usage in map() for stable DOM reconciliation.
// - Computed state (total) derived efficiently using reduce().
