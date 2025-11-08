/*
// ------------------------------------------------------------
// 💾 PHASE 4: Data Flow, APIs & State Management (4–6 Weeks)
// ------------------------------------------------------------
// ✅ TOPIC 8: Context API & Global State
// ------------------------------------------------------------

// ------------------------------------------------------------
// 1️⃣ WHY CONTEXT API EXISTS
// ------------------------------------------------------------
// Problem: In React, data is passed down from parent → child → grandchild using props.
// When a component deep in the tree needs data, we may need to pass props through
// several intermediate components that don’t use them — this is called “PROP DRILLING”.

// Example of Prop Drilling:
import React, { useState } from "react";

function App() {
  const [theme, setTheme] = useState("dark");
  return <Parent theme={theme} />;
}

function Parent({ theme }) {
  // The Parent doesn't even use theme, but has to pass it down
  return <Child theme={theme} />;
}

function Child({ theme }) {
  return <GrandChild theme={theme} />;
}

function GrandChild({ theme }) {
  return <h1>Current theme: {theme}</h1>;
}

export default App;

// ❌ Problem: The `theme` prop is being passed through multiple layers unnecessarily.
// ✅ Solution: Use the React Context API to make data globally accessible.

// ------------------------------------------------------------
// 2️⃣ WHAT IS CONTEXT API
// ------------------------------------------------------------
// Context provides a way to share values (like theme, user info, settings, etc.)
// across your app without manually passing props at every level.

// It consists of 3 main parts:
// 1. Create Context  → React.createContext()
// 2. Provide Context → <Context.Provider>
// 3. Consume Context → useContext() Hook

// ------------------------------------------------------------
// 3️⃣ BASIC CONTEXT EXAMPLE (GLOBAL THEME)
// ------------------------------------------------------------
import React, { createContext, useState, useContext } from "react";

// Step 1: Create a context
const ThemeContext = createContext();

// Step 2: Create a provider component that wraps the app
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    // The `value` prop holds data to share globally
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Step 3: Consume context using useContext() hook
function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Current Theme: {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

// Step 4: Wrap your app with the provider
function App() {
  return (
    <ThemeProvider>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>React Context Example</h1>
        <ThemeButton />
      </div>
    </ThemeProvider>
  );
}

export default App;

// ------------------------------------------------------------
// 🧠 INTERNAL WORKING
// ------------------------------------------------------------
// - createContext() creates an object with { Provider, Consumer }
// - Provider shares the context value to all its children
// - Any component inside can use useContext(ThemeContext)
//   to get the current value without prop drilling.
// - When the value in Provider changes (like `theme`),
//   all components using this context re-render automatically.

// ------------------------------------------------------------
// 4️⃣ AVOIDING PROP DRILLING
// ------------------------------------------------------------
// Let’s see how Context eliminates the need to pass props down manually.

import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user] = useState({ name: "Aditya", role: "Admin" });
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function Profile() {
  const user = useContext(UserContext);
  return (
    <div>
      <h2>User: {user.name}</h2>
      <p>Role: {user.role}</p>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Profile />
    </UserProvider>
  );
}

export default App;

// ✅ The `Profile` component directly accesses `user` data
//   without passing props through multiple layers.

// ------------------------------------------------------------
// 5️⃣ BEST PRACTICES & PATTERNS
// ------------------------------------------------------------
// ✔ Use Context only for truly global data (theme, user, auth, language, settings).
// ❌ Don’t use Context for everything (it causes unnecessary re-renders).
// ✔ Split contexts by domain: ThemeContext, AuthContext, LanguageContext.
// ✔ Use custom hooks to simplify consumption.

// Example of Custom Hook + Context Combination:
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook for easier usage
function useAuth() {
  return useContext(AuthContext);
}

function LoginButton() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <button onClick={isAuthenticated ? logout : login}>
      {isAuthenticated ? "Logout" : "Login"}
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <h1>Custom Hook + Context Example</h1>
      <LoginButton />
    </AuthProvider>
  );
}

export default App;

// ------------------------------------------------------------
// 6️⃣ PERFORMANCE CONSIDERATIONS
// ------------------------------------------------------------
// ⚠ Problem: When context value changes, all components using that context re-render.
// To optimize performance:
// - Split large contexts into smaller ones.
// - Use memoization to prevent unnecessary updates.
// - Avoid passing new object references in value unless memoized.

// Example: Using `useMemo` for optimization
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("light");
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ✅ Now only components depending on theme will re-render when theme changes.

// ------------------------------------------------------------
// 🧩 SUMMARY
// ------------------------------------------------------------
// 🔹 Context API allows global state sharing without prop drilling.
// 🔹 Consists of createContext, Provider, and useContext.
// 🔹 Works perfectly with custom hooks for cleaner architecture.
// 🔹 Should be used only for shared, global data (auth, theme, language).
// 🔹 Optimize performance with memoization and context splitting.

// ------------------------------------------------------------
// ✅ NEXT TOPIC: 9. Redux Toolkit & Alternatives
// ------------------------------------------------------------
*/