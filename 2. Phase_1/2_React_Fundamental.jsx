// ============================================================================
// ⚛️ PHASE 1 → PART 2: REACT FUNDAMENTALS
// ----------------------------------------------------------------------------
// Topics covered step-by-step in this code lesson:
// 1. What is React and why it was created
// 2. React vs other frameworks (Vue, Angular)
// 3. Virtual DOM and Reconciliation
// 4. One-way data flow and component-based design
// 5. Environment setup (Node, npm, Vite / CRA)
// 6. React project structure explanation
// 7. JSX deep dive: Syntax, JS expressions, JSX vs HTML
// 8. Babel transpilation
// ============================================================================



// ============================================================================
// 1️⃣ WHAT IS REACT AND WHY IT WAS CREATED
// ============================================================================

// React is a JavaScript library (not a full framework) built by Facebook in 2013.
// It helps developers build complex user interfaces (UI) in a simple, modular way.

// Problem before React:
// - When the UI had to change (like updating a list or showing a message),
//   developers had to manually update each piece of the DOM.
// - This became slow, repetitive, and error-prone in large web apps.

// React’s solution:
// - Divide the UI into small, reusable parts called "components".
// - Each component can manage its own state (data) and render automatically
//   when data changes.
// - React efficiently updates only the changed parts of the page using a system
//   called the *Virtual DOM* (explained below).

// Example: Instead of manually using document.getElementById() to update elements,
// React re-renders the component automatically when its data (state) changes.


// ============================================================================
// 2️⃣ REACT VS OTHER FRAMEWORKS (VUE, ANGULAR)
// ============================================================================

// ⚛️ React:
// - Library only for the "view" (UI layer).
// - Uses JSX for templating (mixing HTML with JS).
// - Very flexible — you choose routing, state management, etc.
// - Uses Virtual DOM for efficient UI updates.

// 🧩 Vue.js:
// - Framework focused on the UI layer but comes with more built-in features.
// - Uses HTML-based templates (easier for beginners).
// - Has a Virtual DOM too, but with different syntax and structure.

// 🔺 Angular:
// - Full framework maintained by Google.
// - Uses TypeScript and a strict structure (modules, components, services).
// - Two-way data binding (React is one-way).
// - Heavier learning curve but complete solution out of the box.

// TL;DR → React = Flexible, UI-only, large ecosystem.
//           Vue = Simpler start, opinionated structure.
//           Angular = Full enterprise-grade framework.


// ============================================================================
// 3️⃣ VIRTUAL DOM & RECONCILIATION
// ============================================================================

// ⚙️ Virtual DOM (VDOM):
// React keeps a lightweight copy of the real DOM (VDOM) in memory.
// When state or props change, React creates a new VDOM tree,
// compares it with the previous one (diffing), and updates only the changed parts.

// Example visual:
//
// oldVDOM = <ul><li>A</li><li>B</li></ul>
// newVDOM = <ul><li>A</li><li>C</li></ul>
//
// React finds that the 2nd <li> changed from "B" → "C".
// Instead of re-rendering the whole <ul>, it updates only that <li> node.

// This process (diffing + updating real DOM) is called **Reconciliation**.
// It keeps React fast, even in large apps.


// ============================================================================
// 4️⃣ ONE-WAY DATA FLOW & COMPONENT-BASED DESIGN
// ============================================================================

// React follows *unidirectional (one-way) data flow*:
// Data moves from parent → child via "props" (properties).
// Child components can’t directly modify parent data — they use callbacks if needed.

// Example: Parent → Child communication
function Parent() {
  const message = "I love React";

  // Pass data as prop
  return <Child text={message} />;
}

function Child({ text }) {
  // Receive and display prop
  return <p>Child says: {text}</p>;
}

// Example: Child requests change via callback
function CounterParent() {
  const [count, setCount] = React.useState(0);

  return <CounterChild count={count} onIncrement={() => setCount(c => c + 1)} />;
}

function CounterChild({ count, onIncrement }) {
  return (
    <button onClick={onIncrement}>
      Clicked {count} times
    </button>
  );
}

// This structure makes data flow predictable and debugging easier.

// 🧱 Component-based design:
// - Each piece of UI is a *component* (like LEGO blocks).
// - Components can be reused, nested, and maintained independently.


// ============================================================================
// 5️⃣ ENVIRONMENT SETUP (Node, npm, Vite / Create React App)
// ============================================================================

// 🔹 Requirements:
//  - Node.js (LTS version) → runtime & npm (package manager).
//  - Code editor → VS Code recommended.

// ⚡ Create a React app using Vite (modern, fast):
// $ npm create vite@latest my-react-app -- --template react
// $ cd my-react-app
// $ npm install
// $ npm run dev   // starts development server on localhost:5173

// ⚙️ OR Create React App (older but still used):
// $ npx create-react-app my-react-app
// $ cd my-react-app
// $ npm start

// Vite advantages:
// - Faster dev server (ESBuild)
// - Simpler configuration
// - Smaller bundles
// - Built-in HMR (Hot Module Reload)


// ============================================================================
// 6️⃣ REACT PROJECT STRUCTURE & FOLDER EXPLANATION
// ============================================================================

// my-react-app/
// ├─ public/                # static files (index.html, favicon)
// ├─ src/                   # main application source
// │  ├─ assets/             # images, icons, fonts
// │  ├─ components/         # reusable components (Button, Navbar, etc.)
// │  ├─ pages/              # main screens (Home, About, Contact)
// │  ├─ hooks/              # custom React hooks (useAuth, useFetch)
// │  ├─ context/            # global state management via Context API
// │  ├─ services/           # API calls, external integrations
// │  ├─ utils/              # helper functions
// │  ├─ App.jsx             # root component
// │  ├─ main.jsx            # entry point (ReactDOM.createRoot)
// │  └─ index.css           # global stylesheet
// ├─ package.json           # dependencies, scripts
// └─ vite.config.js         # Vite configuration

// In React, folder organization depends on project size.
// For big apps → group by *feature* (FeatureName/components, FeatureName/hooks)


// ============================================================================
// 7️⃣ JSX (JavaScript XML) — SYNTAX, EMBEDDING EXPRESSIONS, JSX VS HTML
// ============================================================================

// JSX allows you to write HTML-like syntax inside JS files.
// It looks like HTML, but under the hood, it's just JS function calls
// (compiled by Babel to React.createElement()).

// Example:
const greeting = <h1>Hello React!</h1>;

// Embedding JS expressions inside JSX:
const name = "Aditya";
const age = 22;
const intro = <p>{`Hi, I’m ${name} and I’m ${age} years old.`}</p>;

// ✅ JSX Rules & Differences from HTML:
// 1. Must return only one parent element.
//    Wrong ❌: return <h1>Hi</h1><p>Bye</p>
//    Correct ✅: return (<div><h1>Hi</h1><p>Bye</p></div>)

// 2. Use className instead of class (class is a JS keyword).
const box = <div className="container">Box</div>;

// 3. Use htmlFor instead of for (used in labels).
const label = <label htmlFor="nameInput">Name</label>;

// 4. All attributes are camelCase: onClick, tabIndex, readOnly, etc.
const button = <button onClick={() => alert("Clicked!")}>Click</button>;

// 5. Self-closing tags must end with `/`.
const img = <img src="logo.png" alt="Logo" />;

// 6. Comments inside JSX: {/* comment here */}

// React component returning JSX:
function Card() {
  const title = "Learning JSX";
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>This is a JSX-based component.</p>
    </div>
  );
}


// ============================================================================
// 8️⃣ BABEL TRANSPILATION — JSX → JavaScript
// ============================================================================

// Browsers cannot read JSX directly.
// Babel (used inside Vite/CRA) transforms JSX → JavaScript before it runs.

// Example transformation:
// JSX code:
const heading = <h1>Hello React!</h1>;

// Babel output (simplified):
// const heading = React.createElement("h1", null, "Hello React!");

// That’s why we import React (or at least React in scope in older versions).
// Newer React versions (17+) use automatic JSX runtime, so explicit import may not be required.

// Babel also converts ES6+ features into older JS syntax for compatibility.

// ✅ In short:
// JSX → Babel → React.createElement() → Virtual DOM → Real DOM update.


// ============================================================================
// 💡 SMALL PRACTICAL DEMO
// ============================================================================

import React from "react";

function App() {
  const [count, setCount] = React.useState(0);
  const name = "Aditya";

  return (
    <div className="app">
      <h1>Hello {name}, welcome to React Fundamentals 🚀</h1>

      <button onClick={() => setCount(c => c + 1)}>
        Clicked {count} times
      </button>

      {count > 5 && <p>Wow! You really love clicking ❤️</p>}
    </div>
  );
}

export default App;


// ============================================================================
// 🧭 SUMMARY
// ============================================================================
//
// • React was created to make UI building easier & efficient using components.
// • Virtual DOM updates only changed parts → fast performance.
// • React has one-way data flow for predictable behavior.
// • JSX is the syntax extension — looks like HTML but compiles to JS.
// • Babel transpiles JSX and ES6+ code into browser-readable JavaScript.
// • Tools: Node + npm + Vite or CRA to set up environment quickly.
// • Organize code by components, hooks, pages, and features.
// • React = powerful, flexible, and declarative way to build UIs.
//
// Next lesson → We'll go deep into:
// "Rendering Elements, Components (Function vs Class), Props, State & Events"
// to understand how components actually behave at runtime.
// ============================================================================
