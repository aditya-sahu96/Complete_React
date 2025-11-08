// 🧠 PHASE 2 → 5. REACT HOOKS DEEP DIVE
// ------------------------------------------------------------
// Hooks were introduced in React 16.8 to let you use state and lifecycle features
// inside functional components without needing class components.
// Think of hooks as "special functions" that let your components use React features
// (like state, side effects, or context) in a cleaner and more modular way.

// ------------------------------------------------------------
// 🚀 5.1 BASIC HOOKS — useState(), useEffect(), useContext()
// ------------------------------------------------------------

import React, { useState, useEffect, useContext, createContext } from "react";

// 🧩 useState — STATE MANAGEMENT
// useState allows functional components to have internal state.
// It returns an array with two elements: [currentState, updateFunction].

function Counter() {
  // count = state variable (current value)
  // setCount = function to update the state
  const [count, setCount] = useState(0);

  // ⚙️ Updating the state
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// 🔍 State Immutability Principle:
// Never modify state directly (like count++).
// Always use the setter (setCount) or pass a callback with previous value.


// ------------------------------------------------------------
// 🧠 useEffect — SIDE EFFECTS, CLEANUP, DEPENDENCIES
// useEffect lets you run side effects (data fetching, event listeners, timers, etc.)
// after the component renders.

function Timer() {
  const [seconds, setSeconds] = useState(0);

  // 🧹 The cleanup function prevents memory leaks.
  useEffect(() => {
    console.log("Timer started...");
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup runs when the component unmounts
    return () => {
      console.log("Timer stopped...");
      clearInterval(interval);
    };
  }, []); // Empty dependency array → runs only once when mounted

  return <h3>Timer: {seconds}s</h3>;
}

// ✅ Dependency Array Rules:
// - [] → runs only on mount
// - [var] → runs when `var` changes
// - no array → runs on every render


// ------------------------------------------------------------
// 🧩 useContext — GLOBAL STATE ACCESS
// Helps share data between deeply nested components without prop drilling.

const ThemeContext = createContext("light");

function ThemeProviderComponent() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme(prev => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Current Theme: {theme}
    </button>
  );
}

// ------------------------------------------------------------
// 🚀 5.2 ADDITIONAL HOOKS
// ------------------------------------------------------------

// 🧩 useReducer — Complex State Management
// useReducer is used when you have multiple related state transitions.
// It is similar to Redux concepts: (state, action) → newState.

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function ReducerCounter() {
  const [state, dispatch] = React.useReducer(reducer, { count: 0 });

  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}


// 🧠 useCallback — Memoized Callbacks
// It prevents functions from being recreated unnecessarily during re-renders.

function Parent() {
  const [count, setCount] = useState(0);

  // memoized function reference
  const increment = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // no dependency → same function reference always

  return <Child onIncrement={increment} count={count} />;
}

function Child({ onIncrement, count }) {
  console.log("Child re-rendered");
  return <button onClick={onIncrement}>Count: {count}</button>;
}


// 🧩 useMemo — Memoized Values
// Memoizes expensive computations between renders.

function ExpensiveCalculation({ num }) {
  const squared = React.useMemo(() => {
    console.log("Calculating square...");
    return num * num;
  }, [num]); // only recalculates if num changes

  return <h3>Square: {squared}</h3>;
}


// 🧩 useRef — DOM Access and Mutable Values
// Stores mutable values that persist between renders without causing re-renders.

function InputFocus() {
  const inputRef = React.useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // direct DOM manipulation
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Click the button to focus me" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}


// 🧩 useLayoutEffect — Runs synchronously after DOM mutations
// Similar to useEffect, but fires earlier (after DOM changes, before painting to screen)

function LayoutExample() {
  const [width, setWidth] = useState(0);
  const divRef = React.useRef(null);

  React.useLayoutEffect(() => {
    setWidth(divRef.current.offsetWidth);
  });

  return (
    <div ref={divRef} style={{ width: "50%" }}>
      <p>Div width: {width}px</p>
    </div>
  );
}


// 🧩 useImperativeHandle — Parent-Child Control
// Allows parent components to call specific methods inside child components.

const ChildInput = React.forwardRef((props, ref) => {
  const inputRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current.focus(),
  }));

  return <input ref={inputRef} placeholder="Controlled by parent" />;
});

function ParentControl() {
  const ref = React.useRef();

  return (
    <div>
      <ChildInput ref={ref} />
      <button onClick={() => ref.current.focusInput()}>Focus Child Input</button>
    </div>
  );
}


// ------------------------------------------------------------
// 🧩 5.3 CUSTOM HOOKS
// ------------------------------------------------------------
// Custom hooks allow you to extract logic from components into reusable functions.
// Always start the name with "use" and can use other hooks inside.

function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [url]);

  return data;
}

function Posts() {
  const posts = useFetch("https://jsonplaceholder.typicode.com/posts");

  return (
    <div>
      <h3>Posts:</h3>
      {posts ? posts.slice(0, 5).map(p => <p key={p.id}>{p.title}</p>) : "Loading..."}
    </div>
  );
}


// ------------------------------------------------------------
// 🧾 SUMMARY:
// 1. useState → Local state
// 2. useEffect → Side effects
// 3. useContext → Global context
// 4. useReducer → Complex state logic
// 5. useCallback → Memoize function
// 6. useMemo → Memoize computed values
// 7. useRef → Access DOM or hold mutable value
// 8. useLayoutEffect → DOM layout synchronization
// 9. useImperativeHandle → Expose functions to parent
// 10. Custom Hooks → Reusable logic units
