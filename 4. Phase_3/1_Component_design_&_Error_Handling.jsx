// ================================================================
// PHASE 3: COMPONENT ARCHITECTURE & BEST PRACTICES (4–6 Weeks)
// Sections covered in this file:
// 6. Component Design & Patterns
//   - Container vs Presentational components
//   - Compound components pattern
//   - Controlled vs Uncontrolled components (recap + advanced patterns)
//   - Render props pattern
//   - Higher-Order Components (HOCs)
//   - Custom hooks + Context for scalable logic sharing
//
// 7. Error Handling & Performance
//   - Error boundaries and fallback UIs
//   - try/catch in components
//   - Error reporting (Sentry, LogRocket) - integration pattern & best practices
//   - Performance optimization: React.memo, useMemo, useCallback
//   - Avoiding unnecessary re-renders
//   - Code splitting: React.lazy + Suspense
//   - Virtualization for large lists (pattern & example using react-window)
// ================================================================

import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  Suspense,
  lazy,
} from "react";

/* ===========================================================================
   6. COMPONENT DESIGN & PATTERNS
   ===========================================================================*/

/* -------------------------
   Container vs Presentational
   -------------------------
   - Presentational components: focus on UI and rendering. Receive data via props.
   - Container components: hold state, side-effects, and pass data/handlers down.
   - Benefit: separation of concerns, easier testing, reusability.
*/

// Presentational (dumb) component — purely renders props
function UserCardPresentational({ user, onToggleFollow }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} style={{ width: 48, height: 48 }} />
      <div>
        <div>{user.name}</div>
        <button onClick={() => onToggleFollow(user.id)}>
          {user.following ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}

// Container (smart) component — handles data and passes down
function UserCardContainer({ userId }) {
  // imagine fetchUser is a service that fetches user data
  const [user, setUser] = useState(null);

  useEffect(() => {
    // pseudo-fetch: replace with real API call
    const u = { id: userId, name: "Aditya", avatar: "/me.png", following: false };
    setUser(u);
  }, [userId]);

  const toggleFollow = (id) => {
    // update state immutably
    setUser((prev) => ({ ...prev, following: !prev.following }));
    // ideally call API to persist change
  };

  if (!user) return <div>Loading user...</div>;
  return <UserCardPresentational user={user} onToggleFollow={toggleFollow} />;
}

/* -------------------------
   Compound Components Pattern
   -------------------------
   - Build a parent component that provides shared state/context for children.
   - Children become flexible building blocks (like Tabs, Accordion, Modal).
   - Useful when children need to coordinate but we want a simple external API.
*/

// Example: Tabs using compound components and context internally
const TabsContext = createContext();

function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  // expose API through context
  const ctx = { activeIndex, setActiveIndex };
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}
function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}
function Tab({ children, index }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={activeIndex === index}
      onClick={() => setActiveIndex(index)}
      style={{ fontWeight: activeIndex === index ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
}
function TabPanel({ children, index }) {
  const { activeIndex } = useContext(TabsContext);
  return activeIndex === index ? <div role="tabpanel">{children}</div> : null;
}

// Usage:
// <Tabs>
//   <TabList>
//     <Tab index={0}>One</Tab>
//     <Tab index={1}>Two</Tab>
//   </TabList>
//   <TabPanel index={0}>Content One</TabPanel>
//   <TabPanel index={1}>Content Two</TabPanel>
// </Tabs>

/* -------------------------
   Controlled vs Uncontrolled (advanced)
   -------------------------
   - Controlled: parent provides value + onChange. Best for validation, derived state, tests.
   - Uncontrolled: DOM manages state; useRef to read values. Simpler for some cases (e.g., file input).
   - Advanced: hybrid pattern — accept value/onChange (controlled) but support defaultValue for uncontrolled usage.
*/

// Hybrid input component supporting controlled and uncontrolled usage
function SmartInput({ value, defaultValue, onChange, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue || "");
  const handleChange = (e) => {
    if (isControlled) {
      onChange && onChange(e.target.value);
    } else {
      setInternal(e.target.value);
    }
  };
  return (
    <input
      {...rest}
      value={isControlled ? value : internal}
      onChange={handleChange}
    />
  );
}

/* -------------------------
   Render Props Pattern
   -------------------------
   - Component accepts a function as a child/prop that returns UI.
   - Gives the caller control over rendering while the component provides behavior/data.
*/

// Example: Mouse position tracker using render prop
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  // children is a function: caller decides how to render position
  return children(pos);
}

// Usage:
// <MouseTracker>{pos => <div>Mouse at {pos.x},{pos.y}</div>}</MouseTracker>

/* -------------------------
   Higher-Order Components (HOCs)
   -------------------------
   - A function that takes a component and returns an enhanced component.
   - Useful for cross-cutting concerns (logging, data fetching, feature flags).
   - Note: prefer hooks & composition in modern React, but HOCs still useful for certain patterns.
*/

// Example HOC: withLoading that shows a loader while data prop is null
function withLoading(WrappedComponent) {
  return function WithLoading(props) {
    if (props.data == null) return <div>Loading...</div>;
    return <WrappedComponent {...props} />;
  };
}

// Usage:
// const UserListWithLoading = withLoading(UserList);

/* -------------------------
   Custom Hooks + Context for scalable logic sharing
   -------------------------
   - Extract shared behavior into custom hooks (useAuth, useFetch, usePagination).
   - Use Context to provide global slices (theme, auth, settings) and combine with hooks for API.
*/

// Example: auth context + hook
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // login/logout pseudo implementations
  const login = async (credentials) => {
    // call API -> setUser
    setUser({ id: 1, name: "Aditya" });
  };
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/* ===========================================================================
   7. ERROR HANDLING & PERFORMANCE
   ===========================================================================*/

/* -------------------------
   Error Boundaries & Fallback UIs
   -------------------------
   - Error boundaries catch rendering errors in child tree (not events or async code).
   - They must be class components (as of React 18) and implement componentDidCatch.
*/

// ErrorBoundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    // update state to render fallback UI
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // log to external service
    // sendErrorToService(error, info);
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      // fallback UI (customizable via props)
      return (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary><App /></ErrorBoundary>

/* -------------------------
   try/catch in components
   -------------------------
   - Use try/catch inside event handlers and async functions inside effects.
   - Remember: try/catch does NOT capture render-time exceptions — use ErrorBoundary for that.
*/

// Example: try/catch inside async effect
function DataLoader() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        if (mounted) setData(json);
      } catch (error) {
        if (mounted) setErr(error);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (err) return <div>Error: {err.message}</div>;
  return data ? <div>{JSON.stringify(data)}</div> : <div>Loading...</div>;
}

/* -------------------------
   Error reporting integration (Sentry, LogRocket) — pattern
   -------------------------
   - Initialize SDK at app entry (only in production with DSN/API key).
   - Capture errors in ErrorBoundary.componentDidCatch and also in catch blocks.
   - Attach user/context metadata for better debugging.
   - DO NOT log sensitive user data.
   - Example (pseudo):
     import * as Sentry from "@sentry/react";
     Sentry.init({ dsn: process.env.SENTRY_DSN });
     // inside componentDidCatch: Sentry.captureException(error, { extra: info });
   - Use breadcrumbs and performance tracing where supported.
*/

// PSEUDO-CODE (do not run here):
/*
if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: "https://xxxx@sentry.io/123" });
}
function componentDidCatch(error, info) {
  Sentry.withScope(scope => {
    scope.setExtras(info);
    Sentry.captureException(error);
  });
}
*/

/* -------------------------
   Performance Optimization
   -------------------------*/

/* React.memo
   - Wrap a component to prevent re-render when props are shallow-equal.
   - Use when component is pure and re-render cost is non-trivial.
*/
const PureChild = React.memo(function PureChild({ value, onClick }) {
  console.log("PureChild render");
  return <button onClick={onClick}>Value: {value}</button>;
});

/* useCallback: memoize function references
   - Pass stable function references down to children to avoid child re-renders.
*/
function ParentMemoExample() {
  const [count, setCount] = useState(0);

  // Without useCallback: increment changes every render => PureChild re-renders
  const increment = useCallback(() => setCount((c) => c + 1), []); // stable reference

  return (
    <div>
      <h3>Count: {count}</h3>
      <PureChild value={count} onClick={increment} />
    </div>
  );
}

/* useMemo: memoize expensive computed values
   - Use for heavy calculations or derived objects passed as props.
*/
function ExpensiveList({ items }) {
  const total = useMemo(() => {
    // heavy computation example
    return items.reduce((sum, x) => sum + x.value, 0);
  }, [items]);

  return <div>Total: {total}</div>;
}

/* Avoiding unnecessary re-renders: checklist
   - Use React.memo for pure components.
   - Keep props shallow (avoid creating new objects inline).
   - Memoize handlers (useCallback).
   - Memoize derived data (useMemo).
   - Use key properly on lists.
   - Avoid passing non-serializable or new references each render.
*/

/* Code splitting: React.lazy + Suspense
   - Lazy-load components to reduce initial bundle size.
   - Suspense shows a fallback while the lazy component loads.
*/
const LazyHeavyComponent = lazy(() => import("./HeavyComponent")); // dynamic import

function AppWithLazy() {
  return (
    <div>
      <h1>App</h1>
      <Suspense fallback={<div>Loading heavy part...</div>}>
        <LazyHeavyComponent />
      </Suspense>
    </div>
  );
}

/* Virtualization for large lists (pattern)
   - Use libraries like react-window or react-virtualized to render only visible items.
   - This dramatically reduces DOM nodes and improves performance for long lists.
   - Simple conceptual example using react-window (pseudo-usage):
     import { FixedSizeList as List } from 'react-window';
     <List height={500} itemCount={items.length} itemSize={35}>
       {({ index, style }) => <div style={style}>{items[index].name}</div>}
     </List>
   - Important: virtualization + dynamic row heights require careful handling.
*/

// Pseudo-example (do not run without installing react-window)
function VirtualizedExample({ items }) {
  // Usage pattern (read library docs for full API)
  // return (
  //   <List height={400} itemCount={items.length} itemSize={50} width="100%">
  //     {({ index, style }) => (
  //       <div style={style} key={items[index].id}>
  //         {items[index].text}
  //       </div>
  //     )}
  //   </List>
  // );
  return <div>See react-window or react-virtualized for virtual list implementation.</div>;
}

/* ===========================================================================
   FINAL NOTES (practical advice)
   ===========================================================================

 - Prefer composition and hooks over HOCs when possible (hooks are simpler).
 - Use Context for app-wide state (theme, auth), but avoid putting frequently changing data there (it causes many re-renders).
 - Split UI into presentational + container components for clarity.
 - Use ErrorBoundary at top-level (and around risky subtrees) to provide graceful UX on runtime errors.
 - Profile with React DevTools Profiler to find expensive renders; then apply memoization or virtualization.
 - Use code-splitting to defer rarely-used code and reduce initial load time.
 - For very large lists or heavy UI, prefer virtualization + memoized row renderers.
 - Always measure (profile) before optimizing — premature optimization can add complexity.

*/

// End of Phase 3: Component Patterns + Error Handling & Performance
// Proceed when you're ready to implement examples, or move to Phase 4 (Data Flow, APIs & State Management).
