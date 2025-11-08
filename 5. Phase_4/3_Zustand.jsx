/*
====================================================
🧠 STATE MANAGEMENT WITH ZUSTAND (BEGINNER TO MASTER)
====================================================

👉 Introduction:
Zustand is a small, fast, and scalable state management library for React.
It helps manage **global state** (like Redux) but with **less boilerplate** and a **simpler API**.

⚡ Think of Zustand as a “lightweight Redux without pain”.
It’s perfect when:
- You don’t need complex reducers, middleware, or extra files.
- You want easy global state sharing.
- You care about performance and simplicity.

====================================================
1️⃣ INSTALLATION
====================================================
To use Zustand, first install it:
*/
// npm install zustand

/*
====================================================
2️⃣ CREATING A BASIC STORE
====================================================

Let’s start with a simple example — a Counter Store.
We’ll create a store that manages count, increment, and decrement.
*/

import { create } from "zustand";

// Step 1: Create a store using the `create()` function
const useCounterStore = create((set) => ({
  count: 0, // state
  increase: () => set((state) => ({ count: state.count + 1 })), // action
  decrease: () => set((state) => ({ count: state.count - 1 })), // action
  reset: () => set({ count: 0 }), // action
}));

// Step 2: Use the store inside a React component
function Counter() {
  const { count, increase, decrease, reset } = useCounterStore();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🧮 Zustand Counter: {count}</h2>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;

/*
✅ Explanation:
- Zustand creates a central store to manage state globally.
- `set()` updates the state.
- `useCounterStore()` is a hook that gives access to the store anywhere in the app.
- No need for reducers, dispatch, or Provider like Redux!

====================================================
3️⃣ HOW ZUSTAND WORKS INTERNALLY (SIMPLIFIED)
====================================================
- Zustand stores are like “tiny React contexts” with built-in optimizations.
- Each component that uses the store subscribes only to the **parts of state** it needs.
- When that part changes, only that component re-renders.
This gives Zustand excellent performance.

====================================================
4️⃣ SELECTING STATE (PARTIAL SUBSCRIPTION)
====================================================
You can select only specific values from the store to avoid re-renders.
*/

function DisplayCount() {
  const count = useCounterStore((state) => state.count);
  return <h3>Current Count: {count}</h3>;
}

/*
Here, only `count` is subscribed. Other updates won’t cause re-render.

====================================================
5️⃣ MULTIPLE STORES
====================================================
You can create separate stores for different features.
*/

const useUserStore = create((set) => ({
  name: "Aditya",
  setName: (newName) => set({ name: newName }),
}));

const useThemeStore = create((set) => ({
  darkMode: false,
  toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
}));

/*
✅ This helps keep your app modular and organized.
Each store is independent but can work together.
*/

function Profile() {
  const { name, setName } = useUserStore();
  const { darkMode, toggleTheme } = useThemeStore();

  return (
    <div style={{ background: darkMode ? "black" : "white", color: darkMode ? "white" : "black" }}>
      <h2>Hello, {name}</h2>
      <button onClick={() => setName("React Master")}>Change Name</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

/*
====================================================
6️⃣ ASYNCHRONOUS ACTIONS (FETCHING DATA)
====================================================
Zustand can easily handle async actions using async/await.
*/

const useTodoStore = create((set) => ({
  todos: [],
  loading: false,

  fetchTodos: async () => {
    set({ loading: true });
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const data = await res.json();
    set({ todos: data, loading: false });
  },
}));

function TodoApp() {
  const { todos, loading, fetchTodos } = useTodoStore();

  return (
    <div>
      <h2>📋 Todo List</h2>
      <button onClick={fetchTodos}>Fetch Todos</button>
      {loading && <p>Loading...</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

/*
✅ Explanation:
- Zustand supports async functions directly — no need for `thunk` or middleware.
- You can directly write `async/await` inside store actions.

====================================================
7️⃣ USING MIDDLEWARE (DEVTOOLS, PERSIST)
====================================================
Zustand supports middleware like Redux DevTools, persistence, and logging.
*/

import { devtools, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    devtools((set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    })),
    { name: "auth-storage" } // store key name in localStorage
  )
);

/*
✅ Explanation:
- `persist` automatically saves the state to localStorage.
- `devtools` allows you to inspect Zustand state changes in Redux DevTools.

====================================================
8️⃣ SHALLOW COMPARISON (PERFORMANCE OPTIMIZATION)
====================================================
By default, Zustand re-renders if any part of the selected state changes.
You can use shallow comparison to prevent unnecessary re-renders.
*/

import { shallow } from "zustand/shallow";

function UserInfo() {
  const { name, age } = useUserStore((state) => ({ name: state.name, age: state.age }), shallow);
  // ✅ React will re-render only if name or age actually changes.
}

/*
====================================================
9️⃣ CONNECTING MULTIPLE STORES (ADVANCED PATTERN)
====================================================
You can combine stores for modular apps.
*/

const useCombinedStore = create((set, get) => ({
  ...useUserStore.getState(),
  ...useCounterStore.getState(),
  resetAll: () => {
    useUserStore.setState({ name: "Guest" });
    useCounterStore.setState({ count: 0 });
  },
}));

/*
✅ Explanation:
- Zustand allows merging states from multiple stores.
- Useful in large-scale apps where modules need to communicate.

====================================================
🔟 COMPARISON: ZUSTAND vs REDUX
====================================================
| Feature                 | Redux Toolkit               | Zustand                      |
|--------------------------|-----------------------------|------------------------------|
| Boilerplate              | High                        | Very low                     |
| Async Handling           | Thunks / Sagas              | Direct async/await           |
| Learning Curve           | Medium                      | Easy                         |
| DevTools Support         | Yes                         | Yes                          |
| Performance              | Good                        | Excellent                    |
| Code Structure           | Actions, Reducers, Store     | Single store function        |
| Persistence              | Manual setup                | Built-in (persist middleware) |

====================================================
SUMMARY
====================================================
✅ Zustand is ideal for small to medium apps or when you want:
- Simplicity
- Great performance
- Minimal boilerplate
- Easy async and persistence

❌ Use Redux (RTK) for:
- Very large enterprise apps
- Complex logic, middleware, or huge teams

====================================================
🔥 MINI PROJECT IDEAS TO PRACTICE ZUSTAND
====================================================
1️⃣ Theme toggler with persistent state  
2️⃣ Authentication system (login/logout saved in localStorage)  
3️⃣ Shopping cart with item count and price  
4️⃣ Notification system using global Zustand store  
5️⃣ Todo list with API integration and filters  
*/

