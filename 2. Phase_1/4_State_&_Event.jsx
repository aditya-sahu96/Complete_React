// ================================================================
// PHASE 1 → PART 2 → Section 4: STATE & EVENTS
// ================================================================
//
// Topics covered in this section:
// 1. useState() Hook
// 2. State immutability principles
// 3. Difference between props and state
// 4. Event handling and synthetic events
// 5. Passing arguments to event handlers
// 6. Controlled vs Uncontrolled components
// 7. Lifting state up
// 8. Conditional rendering (ternary, &&, if/else)
// 9. Rendering lists using .map() and importance of key
//
// Each explained with code + inline commentary for clarity.
// ---------------------------------------------------------------

// ----------------------------------------------------------------
// 1) useState() HOOK — The core of state management in functional components
// ----------------------------------------------------------------

// useState() allows React function components to hold internal state.
// Syntax: const [value, setValue] = useState(initialValue)
// Each component instance has its own isolated state.

import React, { useState } from "react";

function Counter() {
  // Declare a state variable "count" with initial value 0
  const [count, setCount] = useState(0);

  // When setCount is called, React re-renders the component with updated state
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+ Increase</button>
      <button onClick={decrement}>- Decrease</button>
    </div>
  );
}

// Notes:
// - Never modify the state variable directly (like count++) — always use setter.
// - setCount triggers a re-render, but updates are asynchronous and batched for performance.

// ----------------------------------------------------------------
// 2) STATE IMMUTABILITY PRINCIPLES
// ----------------------------------------------------------------
//
// React’s state must be treated as IMMUTABLE — never mutate it directly.
// Why? Because React compares the old and new states to decide what changed.
// Direct mutation breaks this detection and can cause UI not to update correctly.

// ❌ Wrong (mutating state directly)
function BadExample() {
  const [user, setUser] = useState({ name: "Aditya", age: 22 });

  const updateAge = () => {
    user.age = 23; // ❌ direct mutation — React won't detect it properly
    setUser(user); // reuses same reference
  };

  return <button onClick={updateAge}>Update Age</button>;
}

// ✅ Correct (immutable update)
function GoodExample() {
  const [user, setUser] = useState({ name: "Aditya", age: 22 });

  const updateAge = () => {
    setUser({ ...user, age: 23 }); // ✅ creates new object
  };

  return <button onClick={updateAge}>Update Age</button>;
}

// For arrays, always use new arrays:
// setList([...list, newItem]) instead of list.push(newItem)

// ----------------------------------------------------------------
// 3) DIFFERENCE BETWEEN PROPS AND STATE
// ----------------------------------------------------------------
//
// PROPS → data passed *from parent* component to child; read-only in child.
// STATE → data *managed within* the component; can change over time.

// Think: props = external input, state = internal memory.

function ExamplePropsVsState({ initialCount }) {
  // props: read-only input
  const [count, setCount] = useState(initialCount); // internal modifiable state

  return (
    <div>
      <p>Initial (from parent): {initialCount}</p>
      <p>Current (local state): {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ----------------------------------------------------------------
// 4) EVENT HANDLING & SYNTHETIC EVENTS
// ----------------------------------------------------------------
//
// - React wraps native browser events in a cross-browser wrapper called “SyntheticEvent”.
// - This provides consistent behavior across browsers.
// - You attach handlers directly in JSX using camelCase attributes.
//
// Example: onClick, onChange, onSubmit, onMouseEnter, etc.

function EventDemo() {
  const handleClick = (event) => {
    console.log("Button clicked!", event); // event is SyntheticEvent
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}

// Note:
// - React automatically binds event handler context correctly for functional components.
// - You don’t need .bind(this) like in class components.

// ----------------------------------------------------------------
// 5) PASSING ARGUMENTS TO EVENT HANDLERS
// ----------------------------------------------------------------
//
// You can’t directly call a function with arguments inside JSX (it executes immediately).
// Instead, wrap it inside an arrow function.

function DeleteButton({ id, onDelete }) {
  return (
    // Wrong: onClick={onDelete(id)} → executes immediately
    // Correct:
    <button onClick={() => onDelete(id)}>Delete Item #{id}</button>
  );
}

function ParentList() {
  const items = [1, 2, 3];

  const handleDelete = (id) => {
    console.log(`Deleting item ${id}`);
  };

  return (
    <>
      {items.map((item) => (
        <DeleteButton key={item} id={item} onDelete={handleDelete} />
      ))}
    </>
  );
}

// ----------------------------------------------------------------
// 6) CONTROLLED vs UNCONTROLLED COMPONENTS
// ----------------------------------------------------------------
//
// Controlled component → React controls the form input value using state.
// Uncontrolled component → DOM manages its own state (accessed via ref).

// ✅ Controlled example:
function ControlledInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={text} // React controls the value
        onChange={(e) => setText(e.target.value)}
      />
      <p>You typed: {text}</p>
    </div>
  );
}

// ❌ Uncontrolled example:
import { useRef } from "react";

function UncontrolledInput() {
  const inputRef = useRef();

  const handleSubmit = () => {
    alert("You entered: " + inputRef.current.value); // Access DOM directly
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// Controlled = predictable, preferred for React apps
// Uncontrolled = simpler, used when direct DOM access is fine (e.g., file inputs)

// ----------------------------------------------------------------
// 7) LIFTING STATE UP
// ----------------------------------------------------------------
//
// When multiple components need the same shared state, move ("lift") it to their common parent.

function TemperatureInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);

  // Derived value: convert celsius to fahrenheit
  const fahrenheit = (celsius * 9) / 5 + 32;

  return (
    <div>
      <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
      <p>Fahrenheit: {fahrenheit}</p>
    </div>
  );
}

// Here, TemperatureInput doesn’t hold its own state.
// The parent (TemperatureConverter) holds and shares it via props.
// This keeps data consistent between related components.

// ----------------------------------------------------------------
// 8) CONDITIONAL RENDERING
// ----------------------------------------------------------------
//
// React lets you conditionally render parts of the UI using:
// - if statements
// - ternary operator ( condition ? A : B )
// - logical && operator ( condition && A )

function ConditionalExample({ isLoggedIn }) {
  // Using if/else
  if (!isLoggedIn) {
    return <button>Login</button>;
  }

  // Using ternary
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}

function AndOperatorExample({ messages }) {
  // && renders right side only if left side is truthy
  return (
    <div>
      <h3>Inbox</h3>
      {messages.length > 0 && <p>You have {messages.length} messages.</p>}
    </div>
  );
}

// ----------------------------------------------------------------
// 9) RENDERING LISTS USING .map() & IMPORTANCE OF KEY
// ----------------------------------------------------------------
//
// - When rendering multiple elements dynamically, React needs a unique “key” prop
//   for each element to identify which items change, added, or removed efficiently.
//
// - Never use array index as key if items can reorder or change; use unique id.

function TodoList() {
  const todos = [
    { id: 1, task: "Learn React" },
    { id: 2, task: "Build Projects" },
    { id: 3, task: "Get a Job" },
  ];

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.task}</li> // ✅ unique key
      ))}
    </ul>
  );
}

// If you omit the key, React will warn and re-render inefficiently.

// ----------------------------------------------------------------
// SUMMARY — STATE & EVENTS
// ----------------------------------------------------------------
//
// • useState() adds reactive state to function components.
// • Never mutate state directly; always use setter with new objects/arrays.
// • Props = external input, State = internal data that changes over time.
// • React’s event system uses SyntheticEvent for cross-browser consistency.
// • To pass arguments in event handlers, wrap function in arrow fn: () => func(arg).
// • Controlled components = React manages form data; preferred for consistency.
// • Uncontrolled components = DOM manages data; useRef() to access values.
// • Lift state up to a parent when multiple children need the same data.
// • Conditional rendering controls UI visibility based on logic.
// • Lists require unique keys for efficient re-renders.
//
// Next topic → “React Lifecycle & useEffect Hook”
// ================================================================
