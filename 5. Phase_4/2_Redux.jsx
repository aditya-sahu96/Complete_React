// ================================================================
// REDUX & REDUX TOOLKIT — Complete Guide (Beginner → Professional)
// Format: code + inline explanations, easy words, practical examples
// ================================================================

// --------------------------------------------------------------------------------
// 1) WHY REDUX? The problem Redux solves (simple words)
// --------------------------------------------------------------------------------
// - React components have local state. For large apps, multiple components may
//   need to read and update the same data (e.g., user, cart, settings).
// - Passing state via props becomes cumbersome (prop-drilling) and hard to keep
//   in sync across the app.
// - Redux gives a single source of truth (a central store) and predictable
//   state updates (pure reducers), making state changes explicit and traceable.

// Key principles (short):
// - Single source of truth: one store object.
// - State is read-only: updates happen via actions.
// - Changes are made with pure functions called reducers.

// --------------------------------------------------------------------------------
// 2) CORE REDUX CONCEPTS (classic Redux, then RTK replaces most boilerplate)
// --------------------------------------------------------------------------------

// 2.1 Action:
// - A plain JS object describing "what happened".
// - Must have a `type` field (string) and optional `payload`.

const incrementAction = { type: "counter/increment" };
const addTodoAction = { type: "todos/add", payload: { id: 1, text: "Buy milk" } };

// 2.2 Reducer:
// - A pure function (state, action) => newState.
// - Must not mutate state; always return new objects.

function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "counter/increment":
      return { ...state, value: state.value + 1 };
    case "counter/decrement":
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
}

// 2.3 Store:
// - Holds application state, created by createStore (classic) or configureStore (RTK).
// - Allows `getState()`, `dispatch(action)`, and `subscribe(listener)`.

// 2.4 Dispatch:
// - Use store.dispatch(action) to send actions that reducers respond to.

// 2.5 Selectors:
// - Functions to read specific pieces of state: const selectCount = state => state.counter.value

// --------------------------------------------------------------------------------
// 3) CLASSIC REDUX EXAMPLE (for learning; RTK replaces boilerplate later)
// --------------------------------------------------------------------------------
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk"; // example middleware for async

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  // todos: todosReducer, etc.
});

// Create store with middleware (thunk for async)
const storeClassic = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// Dispatch example
storeClassic.dispatch(incrementAction);

// --------------------------------------------------------------------------------
// 4) PROBLEMS WITH CLASSIC REDUX BOILERPLATE
// - Lots of repetitive code (action creators, action types, reducers).
// - Need middleware wiring, immutable updates by hand, large switch statements.
// -> Redux Toolkit (RTK) solves this with simpler APIs and recommended defaults.
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// 5) REDUX TOOLKIT (RTK) — the modern, recommended approach
// --------------------------------------------------------------------------------
// Install: npm i @reduxjs/toolkit react-redux
//
// Key RTK helpers:
// - configureStore() : creates store with good defaults (Redux DevTools, thunk).
// - createSlice() : creates actions + reducer together (less boilerplate).
// - createAsyncThunk() : standard way to handle async logic (thunks) with lifecycle actions.
// - createEntityAdapter() : optimized patterns for normalized collections.
// - RTK Query : advanced data fetching & caching solution.
//
// We'll now build practical examples using RTK.

// --------------------------------------------------------------------------------
// 5.1 SIMPLE COUNTER WITH createSlice
// --------------------------------------------------------------------------------
import { configureStore, createSlice } from "@reduxjs/toolkit";

// createSlice auto-generates action creators and action types.
const counterSlice = createSlice({
  name: "counter", // action type prefix
  initialState: { value: 0 },
  reducers: {
    // "mutating" code is allowed here thanks to Immer (it produces immutable updates)
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    addBy(state, action) {
      state.value += action.payload; // payload is number to add
    },
  },
});

// Export auto-generated actions:
export const { increment, decrement, addBy } = counterSlice.actions;

// Create store (RTK sets up thunk & devtools by default)
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    // other slices here...
  },
});

// Usage:
store.dispatch(increment()); // dispatches {type: 'counter/increment'}
store.dispatch(addBy(5)); // dispatches with payload 5

// Read state:
console.log(store.getState().counter.value);

// --------------------------------------------------------------------------------
// 5.2 ASYNC FLOWS with createAsyncThunk
// --------------------------------------------------------------------------------
// createAsyncThunk auto-generates pending/fulfilled/rejected action types and helps
// handle loading/error state without manually creating lots of actions.

import { createAsyncThunk } from "@reduxjs/toolkit";

// Example: fetch todos from API
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos", // action type prefix
  async (userId, thunkAPI) => {
    // thunkAPI has getState(), dispatch(), extra, rejectWithValue(), signal for abort
    const response = await fetch(`/api/users/${userId}/todos`);
    if (!response.ok) {
      // optional: return rejectWithValue(customError)
      throw new Error("Network error while fetching todos");
    }
    const data = await response.json();
    return data; // becomes action.payload in fulfilled reducer
  }
);

// Setup slice handling lifecycle actions
import { createSlice as createSlice2 } from "@reduxjs/toolkit";

const todosSlice = createSlice2({
  name: "todos",
  initialState: {
    entities: [], // raw list (we'll show normalized later)
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addTodoLocal(state, action) {
      state.entities.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload; // set fetched todos
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTodoLocal } = todosSlice.actions;

// Add to store:
const storeWithTodos = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

// Dispatch async thunk:
storeWithTodos.dispatch(fetchTodos(123));

// --------------------------------------------------------------------------------
// 5.3 RTK QUERY — DATA FETCHING & CACHING (recommended for many cases)
// --------------------------------------------------------------------------------
// RTK Query is a powerful data fetching and caching solution built on RTK.
// It auto-generates hooks (useGetXQuery), caching, invalidation, polling, and more.

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define an API slice
export const api = createApi({
  reducerPath: "api", // optional, default 'api'
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Todos", "User"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: (userId) => `users/${userId}/todos`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Todos", id })), { type: "Todos", id: "LIST" }]
          : [{ type: "Todos", id: "LIST" }],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),
  }),
});

// Expose hooks auto-generated by RTK Query:
export const { useGetTodosQuery, useAddTodoMutation } = api;

// Add api.reducer to store and api.middleware for RTK Query to work
const storeWithApi = configureStore({
  reducer: {
    // ...other reducers
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

// Usage in React component (auto hooks):
/*
function TodosComponent({ userId }) {
  const { data: todos, error, isLoading } = useGetTodosQuery(userId);
  const [addTodo] = useAddTodoMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>
      <button onClick={() => addTodo({ title: "New" })}>Add</button>
    </div>
  );
}
*/

// RTK Query handles caching, request deduplication, automatic refetch-on-focus, etc.
// It is the recommended approach for server data in many apps (unless you need custom caching).

// --------------------------------------------------------------------------------
// 6) NORMALIZATION & createEntityAdapter (professional pattern)
// --------------------------------------------------------------------------------
// Normalizing state shape (entities + ids) improves performance and ease of updates.
// createEntityAdapter provides helpers for normalized CRUD ops.

import { createEntityAdapter } from "@reduxjs/toolkit";

const todosAdapter = createEntityAdapter({
  // optional: selectId: (todo) => todo.id, sortComparer: (a,b) => a.date - b.date
});

const initialTodosState = todosAdapter.getInitialState({ status: "idle", error: null });

const normalizedTodosSlice = createSlice({
  name: "normalizedTodos",
  initialState: initialTodosState,
  reducers: {
    addOne: todosAdapter.addOne, // predefined reducers
    removeOne: todosAdapter.removeOne,
    updateOne: todosAdapter.updateOne, // expects {id, changes}
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      todosAdapter.setAll(state, action.payload); // populate entities
      state.status = "succeeded";
    });
  },
});

// Selectors generated for easy consumption:
const todosSelectors = todosAdapter.getSelectors((state) => state.normalizedTodos);
export const selectAllTodos = (state) => todosSelectors.selectAll(state);
export const selectTodoById = (state, id) => todosSelectors.selectById(state, id);

// --------------------------------------------------------------------------------
// 7) MIDDLEWARE (logging, analytics) & THUNK DETAILS
// --------------------------------------------------------------------------------
// Middleware wraps dispatch to intercept actions. Common uses: logging, crash reporting,
// async logic (thunk), metrics, authorization headers.

const loggerMiddleware = (storeAPI) => (next) => (action) => {
  console.log("dispatching", action);
  const result = next(action);
  console.log("next state", storeAPI.getState());
  return result;
};

// Thunks: functions dispatched with dispatch(thunkFunction)
// They receive (dispatch, getState, extra) and allow async flows
const exampleThunk = (payload) => async (dispatch, getState) => {
  dispatch({ type: "example/start" });
  try {
    const res = await fetch("/api/do", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    dispatch({ type: "example/success", payload: json });
  } catch (err) {
    dispatch({ type: "example/fail", error: err.toString() });
  }
};

// RTK's configureStore automatically adds thunk middleware; you can add custom middleware too:
// const store = configureStore({ reducer: rootReducer, middleware: (gdm) => gdm().concat(loggerMiddleware) });

// --------------------------------------------------------------------------------
// 8) SELECTORS & RESELECT (performance)
// --------------------------------------------------------------------------------
// Accessing derived data in selectors avoids recomputing in components.
// Reselect creates memoized selectors that only recompute when inputs change.

import { createSelector } from "reselect";

const selectTodosState = (state) => state.normalizedTodos;
const selectAll = (state) => selectTodosState(state).entities;

// derived selector example
const selectCompletedTodos = createSelector([selectAll], (entities) =>
  Object.values(entities).filter((t) => t.completed)
);

// Using memoized selectors prevents expensive computations on every render.

// --------------------------------------------------------------------------------
// 9) TYPICAL FOLDER STRUCTURE (RTK recommended)
// --------------------------------------------------------------------------------
// src/
// ├─ app/
// │  └─ store.js           // configureStore and root reducers
// ├─ features/
// │  ├─ counter/
// │  │  ├─ counterSlice.js // slice + selectors + actions
// │  │  └─ Counter.jsx     // UI component using useSelector/useDispatch
// │  └─ todos/
// │     ├─ todosSlice.js
// │     └─ TodosList.jsx
// ├─ api/
// │  └─ apiSlice.js        // RTK Query api
// ├─ components/
// └─ hooks/
//    └─ useAuth.js
//
// Keep logic, selectors, and slice in same feature folder for cohesion.
// Put store configuration under app/store.js.

// --------------------------------------------------------------------------------
// 10) BEST PRACTICES & PATTERNS (professional)
// --------------------------------------------------------------------------------
// - Prefer RTK over classic Redux (less boilerplate, safer defaults).
// - Use createSlice to colocate reducer + actions.
// - Use createAsyncThunk for async flows when not using RTK Query.
// - Use RTK Query for server data with caching/invalidation when possible.
// - Normalize state for collections; use createEntityAdapter for CRUD helpers.
// - Keep UI components unaware of Redux; use container components or custom hooks
//   (e.g., useTodos) to isolate Redux API usage.
// - Memoize selectors with reselect to avoid expensive recomputations.
// - Avoid storing derived values in Redux; compute in selectors instead.
// - Keep store as minimal as needed — don't dump huge non-serializable objects (like DOM nodes) into Redux.
// - For optimistic UI updates, make sure to handle rollback on failure.
// - Write tests for reducers and async thunks (RTK makes reducers small and testable).
// - Use Redux DevTools for time-travel debugging during development.

// --------------------------------------------------------------------------------
// 11) TESTING (short overview)
// --------------------------------------------------------------------------------
// - Reducer tests: call reducer with initialState + action and assert new state.
// - Thunk tests: mock fetch and dispatch the thunk, assert dispatch calls.
// - RTK Query: test components using msw (Mock Service Worker) for network mocking.
// - Example reducer unit test concept:
/*
import counterReducer, { increment } from './counterSlice';
test('increment increases value', () => {
  const initial = { value: 0 };
  const next = counterReducer(initial, increment());
  expect(next.value).toBe(1);
});
*/

// --------------------------------------------------------------------------------
// 12) TYPESCRIPT NOTES (brief)
// --------------------------------------------------------------------------------
// - Use createSlice with generics for state type.
// - Use AppDispatch = typeof store.dispatch; AppState = ReturnType<typeof store.getState>
// - Strong typing improves developer experience in large apps.

// Example typing sketch:
/*
type CounterState = { value: number };
const counterSlice = createSlice<CounterState, ...>({ ... });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
function useAppDispatch() { return useDispatch<AppDispatch>(); }
function useAppSelector<T>(selector: (state: RootState) => T) { return useSelector(selector); }
*/

// --------------------------------------------------------------------------------
// 13) WHEN TO USE REDUX / RTK VS LIGHTER ALTERNATIVES
// --------------------------------------------------------------------------------
// Use Redux / RTK when:
// - App has complex global state shared across many components.
// - You need time-travel debugging, strict traceable updates, or a predictable update flow.
// - Complex caching, normalized entities, and optimistic updates are required.
//
// Consider alternatives (Zustand, Jotai, Context + useReducer, React Query/RTK Query for server state):
// - For small apps or simple global flags → Context + useState may suffice.
// - For mostly server-synced data → React Query or RTK Query might cover needs without heavy local store.
// - For simpler local state with minimal boilerplate → Zustand is lean and fast.

// --------------------------------------------------------------------------------
// 14) FULL MINI EXAMPLE: Todos feature using RTK, normalized state, and a component
// --------------------------------------------------------------------------------
// files merged here for demo: features/todos/todosSlice.js + TodosList.jsx

// todosSlice.js (simplified)
import { createSlice as cs, createAsyncThunk as cat, createEntityAdapter as cea } from "@reduxjs/toolkit";

const todosAdapter2 = cea({ selectId: (t) => t.id });

export const fetchTodos2 = cat("todos/fetchTodos", async () => {
  const res = await fetch("/api/todos");
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
});

const todosSlice2 = cs({
  name: "todos",
  initialState: todosAdapter2.getInitialState({ status: "idle", error: null }),
  reducers: {
    addLocal: todosAdapter2.addOne,
    removeLocal: todosAdapter2.removeOne,
    updateLocal: todosAdapter2.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos2.pending, (state) => { state.status = "loading"; })
      .addCase(fetchTodos2.fulfilled, (state, action) => { todosAdapter2.setAll(state, action.payload); state.status = "succeeded"; })
      .addCase(fetchTodos2.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; });
  },
});

export const { addLocal, removeLocal, updateLocal } = todosSlice2.actions;
export default todosSlice2.reducer;

// Selectors:
export const { selectAll: selectAllTodos2, selectById: selectTodoById2 } = todosAdapter2.getSelectors((state) => state.todos);

// TodosList.jsx (component)
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { selectAllTodos2, fetchTodos2, removeLocal } from './todosSlice.js'

function TodosList() {
  const dispatch = useDispatch();
  const todos = useSelector(selectAllTodos2);
  const status = useSelector((s) => s.todos.status);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos2());
    }
  }, [status, dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading todos</div>;

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          {t.title}
          <button onClick={() => dispatch(removeLocal(t.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// --------------------------------------------------------------------------------
// END: Redux + Redux Toolkit Masterclass (concise but complete)
// --------------------------------------------------------------------------------

// If you want, I can now:
// - Create a runnable example project (Vite + React + RTK + RTK Query) with all files ready.
// - Convert examples to TypeScript with typed slices, store, hooks.
// - Show unit tests for a slice and an async thunk with Jest + msw.
// Tell me which follow-up you'd like and I'll produce full code files in same style.
