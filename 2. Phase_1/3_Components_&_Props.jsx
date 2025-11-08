// ================================================================
// PHASE 1 → PART 2 → Section 3: COMPONENTS & PROPS
// ================================================================

// This lesson covers:
// 1. Functional components vs Class components
// 2. Component creation rules (naming, pure vs impure, single responsibility)
// 3. Passing data via props
// 4. Props validation with PropTypes
// 5. Children prop and reusability
// 6. Default props
// 7. Component composition and hierarchy
// Each example includes inline explanation comments.

// ----------------------------------------------------------------
// 1) FUNCTIONAL COMPONENTS vs CLASS COMPONENTS (overview + examples)
// ----------------------------------------------------------------

// 1A. Functional component (recommended modern approach)
// - It's a JavaScript function that returns JSX.
// - Lightweight, easier to read, easier to test.
// - Can use React Hooks (useState, useEffect, etc.).
// - Preferred for most use-cases in modern React.

import React, { useState, useEffect } from "react";

function GreetingFunctional({ name }) {
  // This is a functional component that accepts props as function args.
  // It's "pure" if it renders the same output for the same props/state.

  // local state with hook:
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // side-effect (timer) — useEffect replaces lifecycle methods in classes
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []); // empty deps => run once on mount

  return (
    <div>
      <h2>Hello, {name} (Functional)</h2>
      <p>Local clock: {time}</p>
    </div>
  );
}

// 1B. Class component (older style — still valid & sometimes used)
// - Has lifecycle methods (constructor, componentDidMount, render, etc.).
// - 'this' context required for methods and state.
// - Hooks cannot be used inside class components.

class GreetingClass extends React.Component {
  constructor(props) {
    super(props); // must call super in constructor
    // initialize local state
    this.state = { time: new Date().toLocaleTimeString() };

    // bind a method if you pass it directly as callback (alternative: use class fields)
    this.tick = this.tick.bind(this);
  }

  tick() {
    // update state (triggers re-render)
    this.setState({ time: new Date().toLocaleTimeString() });
  }

  componentDidMount() {
    // lifecycle: runs after component is mounted
    this.timerId = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    // lifecycle: run before component is removed
    clearInterval(this.timerId);
  }

  render() {
    // render uses this.props and this.state
    const { name } = this.props;
    const { time } = this.state;

    return (
      <div>
        <h2>Hello, {name} (Class)</h2>
        <p>Local clock: {time}</p>
      </div>
    );
  }
}

// ✅ Modern recommendation:
// Prefer functional components + hooks for new code.
// Class components are still important to understand for legacy codebases.

// ----------------------------------------------------------------
// 2) COMPONENT CREATION RULES (practical guidelines)
// ----------------------------------------------------------------

// - Component names must start with an uppercase letter (React treats lowercase as DOM tags).
// - A component must return either JSX, null, or another React element.
// - Keep components small and single-responsibility (one job).
// - Avoid side-effects directly in render — use useEffect or lifecycle methods.
// - Prefer pure components (output depends only on props & state) for predictability.
// - Use prop destructuring for readability: function Button({ onClick, children }) { ... }

// Example of an invalid component (will break):
// function invalidcomponent() { return <div>bad</div>; }
// -> React will consider it a "div" if the name is lowercase. Use PascalCase.

// ----------------------------------------------------------------
// 3) PROPS — PASSING DATA BETWEEN COMPONENTS (examples + notes)
// ----------------------------------------------------------------

// Props are read-only (child should not mutate them).
// They allow parent -> child communication.

function UserCard({ user }) {
  // 'user' is a prop passed from parent
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role ?? "User"}</p> {/* using nullish coalescing */}
    </div>
  );
}

function ParentExample() {
  const user = { name: "Aditya", email: "a@example.com", role: "admin" };

  // Pass 'user' as a prop to UserCard
  return <UserCard user={user} />;
}

// Important: Props are immutable inside child. If child needs to change data,
// parent must provide a callback (onChange) that updates parent's state.

// Example: callback from child to parent
function Toggle({ onToggle, value }) {
  return <button onClick={() => onToggle(!value)}>{String(value)}</button>;
}

function ParentToggle() {
  const [on, setOn] = useState(false);
  return <Toggle value={on} onToggle={setOn} />;
}

// ----------------------------------------------------------------
// 4) PROPS VALIDATION WITH PropTypes (runtime checks)
// ----------------------------------------------------------------

// PropTypes is a small library to validate props at runtime (development only).
// It helps catch incorrect prop types or missing required props during development.

// Install: npm install prop-types
import PropTypes from "prop-types";

function Badge({ label, count }) {
  return (
    <div>
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
}

// Define prop types and requiredness:
Badge.propTypes = {
  label: PropTypes.string.isRequired, // must be string
  count: PropTypes.number, // optional number
};

// Default props can be defined (see next section)
Badge.defaultProps = {
  count: 0,
};

// Notes:
// - PropTypes are only checked in development and will not affect production bundle size if removed.
// - If using TypeScript, prefer type-checking with TS instead of PropTypes.

// ----------------------------------------------------------------
// 5) CHILDREN PROP & REUSABILITY
// ----------------------------------------------------------------

// 'children' is a special prop that contains nested JSX passed between opening and closing tags.
// It enables extremely flexible and reusable components.

function Card({ title, children }) {
  // `children` can be any ReactNode (string, element, fragment, array...)
  return (
    <div className="card">
      {title && <h4>{title}</h4>}
      <div className="card-body">{children}</div>
    </div>
  );
}

// Use it like:
function ChildrenExample() {
  return (
    <Card title="Profile">
      <p>This content is passed as children</p>
      <button>Edit</button>
    </Card>
  );
}

// Advanced children patterns:
// - Render prop: children is a function: <DataLoader>{data => <View data={data} />}</DataLoader>
// - Cloning/inspecting children: React.Children.map / React.cloneElement
// Example — safely add props to all children:
function AddClassToChildren({ children, className }) {
  return (
    <>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { className }) : child
      )}
    </>
  );
}

// ----------------------------------------------------------------
// 6) DEFAULT PROPS
// ----------------------------------------------------------------

// Default props define fallback values when parent doesn't provide a prop.
// For class components and older functional components, you can use defaultProps.
// For modern functional components, prefer default parameter values or defaultProps for consistency.

// Using defaultProps (works for function and class components):
function Label({ text }) {
  return <span>{text}</span>;
}
Label.defaultProps = {
  text: "Default label",
};

// Using ES6 default parameter (functional components):
function Badge2({ label = "Default Label", count = 0 }) {
  return (
    <div>
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
}

// Note: When using TypeScript, use types/interfaces and optional properties instead.

// ----------------------------------------------------------------
// 7) COMPONENT COMPOSITION & HIERARCHY (patterns + examples)
// ----------------------------------------------------------------

// Composition over inheritance: React encourages building UI by composing components.
// Small components compose into bigger components — easier to test and reuse.

// Example: building a UserProfile from small pieces
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserInfo({ user }) {
  return (
    <div>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
    </div>
  );
}

function UserProfile({ user }) {
  // Compose smaller components into a larger feature component
  return (
    <div className="user-profile">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo user={user} />
    </div>
  );
}

// Hierarchy example:
// App (root)
// ├─ Header
// ├─ Dashboard
// │  ├─ UserProfile
// │  │  ├─ Avatar
// │  │  └─ UserInfo
// │  └─ ActivityList
// └─ Footer

// Communication pattern:
// - Parent passes data via props to children.
// - Children can call callbacks to request changes.
// - For deeply nested props, use Context or state management (Redux/Zustand).

// ----------------------------------------------------------------
// PRACTICE & PRO TIPS (short bullets)
// ----------------------------------------------------------------

// - Keep components focused: one responsibility each.
// - Prefer small presentational components and separate container components that handle logic.
// - Use PropTypes or TypeScript to catch mistakes early.
// - Use children and composition to build flexible UI primitives.
// - Avoid mutating props — they are read-only. Use callbacks to update parent state.
// - Use naming conventions: PascalCase for components, kebab/camelCase for CSS classes.
// - Test components in isolation (unit tests) and with integration tests for composed behavior.

// ----------------------------------------------------------------
// QUICK SUMMARY
// ----------------------------------------------------------------
//
// • Functional components (with hooks) are the modern standard.
// • Class components still appear in legacy code; know lifecycle methods.
// • Props are the mechanism for parent → child data flow and must be treated read-only.
// • Use PropTypes in JS projects to validate prop shapes in development.
// • The special children prop enables powerful composition patterns.
// • Default props provide fallback values; prefer ES6 defaults for simple cases.
// • Build UI by composing small components into larger ones (composition > inheritance).
//
// Next: We will cover State, Events, Conditional rendering, and Lists & Keys
// (Phase 1 → Part 2 → State & Events) in the same detailed code format.
// ================================================================
