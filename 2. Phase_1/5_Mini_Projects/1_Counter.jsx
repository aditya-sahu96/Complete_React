// ================================================================
// MINI PROJECT 1: COUNTER APP
// ================================================================
//
// Goal: Understand useState(), event handling, and reactivity.
//
// Concepts covered:
// - Declaring and updating state
// - Handling click events
// - Conditional rendering and disabling buttons
// ---------------------------------------------------------------

import React, { useState } from "react";

function CounterApp() {
  // Step 1: Declare state variable "count" with initial value 0
  const [count, setCount] = useState(0);

  // Step 2: Define event handlers
  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => {
    if (count > 0) setCount(count - 1); // prevent going below 0
  };
  const handleReset = () => setCount(0);

  // Step 3: Render UI with dynamic values
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>React Counter</h1>
      <h2>Count: {count}</h2>

      {/* Buttons trigger state updates */}
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement} disabled={count === 0}>
        -
      </button>
      <button onClick={handleReset}>Reset</button>

      {/* Conditional Rendering */}
      {count >= 10 && <p>🔥 You’ve reached double digits!</p>}
    </div>
  );
}

export default CounterApp;

// ----------------------------------------------------------------
// Explanation:
//
// 1. `useState(0)` → initializes "count" with 0. React remembers this between renders.
// 2. Clicking "+" calls setCount(count + 1). React re-renders with updated state.
// 3. Conditional rendering: shows a message when count >= 10.
// 4. Button disabled dynamically using {count === 0}.
// 5. Each re-render is isolated — React efficiently updates only changed parts.
// ================================================================
