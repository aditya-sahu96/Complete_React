// ================================================================
// MINI PROJECT 2: TODO LIST
// ================================================================
//
// Goal: Manage dynamic list data with React state.
// ---------------------------------------------------------------

import React, { useState } from "react";

function TodoListApp() {
  // Step 1: Define state variables
  const [task, setTask] = useState(""); // input value
  const [todos, setTodos] = useState([]); // list of tasks

  // Step 2: Add a new todo
  const handleAddTodo = () => {
    if (task.trim() === "") return; // ignore empty input

    const newTodo = {
      id: Date.now(), // unique key
      text: task,
      completed: false,
    };

    // Immutable update: new array
    setTodos([...todos, newTodo]);
    setTask(""); // clear input field
  };

  // Step 3: Toggle completion
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Step 4: Delete a todo
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>React Todo List</h1>

      {/* Controlled Input */}
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add</button>

      {/* List Rendering */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ margin: "10px 0" }}>
            <span
              onClick={() => toggleComplete(todo.id)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.text}
            </span>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(todo.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {/* Conditional Rendering */}
      {todos.length === 0 && <p>No tasks yet. Add one!</p>}
    </div>
  );
}

export default TodoListApp;

// ----------------------------------------------------------------
// Explanation:
//
// • useState([]) holds our todos list.
// • useState("") holds input field text (controlled component).
// • We always update arrays immutably using spread [...todos, newTodo].
// • Each todo item must have a unique key (id).
// • Clicking text toggles completion (updates state immutably).
// • Filter removes a specific todo based on its id.
// • Conditional rendering shows message when no tasks exist.
// ================================================================
