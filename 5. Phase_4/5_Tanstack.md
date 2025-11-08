/*
==========================
🔥 TANSTACK QUERY (REACT QUERY) — COMPLETE MASTER GUIDE
==========================

TanStack Query (formerly React Query) is one of the most powerful data-fetching and state management libraries in React.  
It helps you handle API requests efficiently — including **fetching**, **caching**, **updating**, **refetching**, and **synchronizing** your data automatically.

Imagine you're building an app like Amazon or Zomato — you have tons of API calls (products, users, reviews, orders, etc.).  
Manually handling loading states, caching, and refetching would be painful and error-prone.  
That’s where TanStack Query saves the day — it automates all of it intelligently.

Let’s learn it **step by step with code and real-life examples**.
*/

/////////////////////////////////////////////
// 1️⃣ INSTALLATION & SETUP
/////////////////////////////////////////////

/*
Install TanStack Query:
------------------------------------
npm install @tanstack/react-query
------------------------------------

You’ll also need React Query DevTools (optional but super useful):
------------------------------------
npm install @tanstack/react-query-devtools
------------------------------------
*/

// In your main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient(); // manages all queries globally

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} /> {/* useful for debugging */}
  </QueryClientProvider>
);

/////////////////////////////////////////////
// 2️⃣ BASIC DATA FETCHING — useQuery
/////////////////////////////////////////////

/*
useQuery is the heart of TanStack Query.
It automatically fetches and caches your data.
*/

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Users() {
  const fetchUsers = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"], // unique identifier for caching
    queryFn: fetchUsers,  // function to fetch data
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>👥 Users List</h2>
      {data.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

/*
✨ Real-life use case:
Imagine you’re building a Zomato “All Restaurants” page.
Each time you visit, you don’t want to refetch if you already have cached data.
TanStack Query caches it automatically!
*/

/////////////////////////////////////////////
// 3️⃣ CACHING & REFETCHING BEHAVIOR
/////////////////////////////////////////////

/*
Caching: TanStack stores fetched data in memory for 5 minutes by default.
So, if you visit the same component again — it loads instantly from cache.

Refetching: You can control when to refetch.
*/

const { data } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 10, // 10 mins - data is considered "fresh"
  cacheTime: 1000 * 60 * 30, // 30 mins - stays in cache
  refetchOnWindowFocus: false, // avoids auto refetch when switching tabs
});

/////////////////////////////////////////////
// 4️⃣ DYNAMIC QUERIES (WITH PARAMETERS)
/////////////////////////////////////////////

/*
Example: Fetch user details based on selected user ID.
*/

function UserDetails({ userId }) {
  const fetchUserById = async (id) => {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // fetch only when userId exists
  });

  if (isLoading) return <p>Loading user details...</p>;

  return <div>{data.name}</div>;
}

/*
💡 Example: In an e-commerce site, when a user clicks a product, 
you fetch that specific product's details dynamically.
*/

/////////////////////////////////////////////
// 5️⃣ MUTATIONS (POST, PUT, DELETE)
/////////////////////////////////////////////

/*
useMutation is used for creating, updating, or deleting data.
It doesn’t cache automatically like useQuery.
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddUser() {
  const queryClient = useQueryClient();

  const addUser = async (newUser) => {
    return axios.post("https://jsonplaceholder.typicode.com/users", newUser);
  };

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // refetch updated list
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({ name: "New User", email: "new@user.com" })
      }
    >
      Add User
    </button>
  );
}

/*
💡 Example: When you submit a form to create a new product or post a review,
you use useMutation. It also automatically refetches the updated list.
*/

/////////////////////////////////////////////
// 6️⃣ OPTIMISTIC UPDATES (Instant UI Update)
/////////////////////////////////////////////

/*
Shows instant UI updates before API confirms (for better UX)
*/

const mutation = useMutation({
  mutationFn: addUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries(["users"]);
    const previousUsers = queryClient.getQueryData(["users"]);

    queryClient.setQueryData(["users"], (old) => [...old, newUser]);

    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(["users"], context.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["users"]);
  },
});

/*
💡 Example: In Instagram, when you “like” a post,
the like count updates immediately (optimistic update) without waiting for API response.
*/

/////////////////////////////////////////////
// 7️⃣ PAGINATION & INFINITE SCROLLING
/////////////////////////////////////////////

/*
Pagination: Load data page by page.
*/

import { useInfiniteQuery } from "@tanstack/react-query";

const fetchUsersPage = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_page=${pageParam}&_limit=5`
  );
  return res.data;
};

function InfiniteUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: fetchUsersPage,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
  });

  return (
    <div>
      {data?.pages.flat().map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}

/*
💡 Example: Like YouTube comment section — loads more comments when scrolled down.
*/

/////////////////////////////////////////////
// 8️⃣ BACKGROUND SYNC & REFRESH
/////////////////////////////////////////////

/*
Automatically refetches data in background (useful for dashboards)
*/

useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  refetchInterval: 5000, // refresh every 5 sec
});

/*
💡 Example: In a stock trading app, data refreshes in background every few seconds.
*/

/////////////////////////////////////////////
// 9️⃣ ERROR HANDLING
/////////////////////////////////////////////

useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  retry: 2, // retry twice before failing
  onError: (error) => {
    console.error("Error fetching users:", error.message);
  },
});

/////////////////////////////////////////////
// 🔟 CUSTOM HOOKS WITH REACT QUERY
/////////////////////////////////////////////

/*
To keep code clean, move fetching logic into custom hooks.
*/

function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      return res.data;
    },
  });
}

function UserList() {
  const { data, isLoading } = useUsers();
  if (isLoading) return <p>Loading...</p>;
  return data.map((u) => <p key={u.id}>{u.name}</p>);
}

/*
💡 Example: In large-scale apps (like Airbnb), you’ll create multiple custom hooks 
like useUsers, useBookings, useRooms — all separated logically.
*/

/////////////////////////////////////////////
// 🔥 SUMMARY
/////////////////////////////////////////////
/*
✅ TanStack Query simplifies everything related to data fetching:
   - Fetching APIs with caching and auto-refetch
   - Mutation with optimistic updates
   - Pagination and infinite scroll
   - Error handling and retry
   - Background sync
   - Works perfectly with Axios and REST APIs or GraphQL

✅ Real-world companies like Netflix, Shopify, and Coinbase use React Query.

💡 Think of TanStack Query as a personal data manager for your app — 
it automatically keeps your data fresh, fast, and in sync with the server.
*/

/////////////////////////////////////////////
// 🚀 ADVANCED PRACTICE IDEAS
/////////////////////////////////////////////
/*
1️⃣ Build a cryptocurrency dashboard — live prices updating every few seconds.
2️⃣ Create a blog app with pagination, CRUD, and optimistic updates.
3️⃣ Make a stock tracker using background refetching and caching.
4️⃣ Build a shopping cart using React Query + useMutation + Context.
*/
/*
==========================
🔥 TANSTACK QUERY (REACT QUERY) — COMPLETE MASTER GUIDE
==========================

TanStack Query (formerly React Query) is one of the most powerful data-fetching and state management libraries in React.  
It helps you handle API requests efficiently — including **fetching**, **caching**, **updating**, **refetching**, and **synchronizing** your data automatically.

Imagine you're building an app like Amazon or Zomato — you have tons of API calls (products, users, reviews, orders, etc.).  
Manually handling loading states, caching, and refetching would be painful and error-prone.  
That’s where TanStack Query saves the day — it automates all of it intelligently.

Let’s learn it **step by step with code and real-life examples**.
*/

/////////////////////////////////////////////
// 1️⃣ INSTALLATION & SETUP
/////////////////////////////////////////////

/*
Install TanStack Query:
------------------------------------
npm install @tanstack/react-query
------------------------------------

You’ll also need React Query DevTools (optional but super useful):
------------------------------------
npm install @tanstack/react-query-devtools
------------------------------------
*/

// In your main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient(); // manages all queries globally

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} /> {/* useful for debugging */}
  </QueryClientProvider>
);

/////////////////////////////////////////////
// 2️⃣ BASIC DATA FETCHING — useQuery
/////////////////////////////////////////////

/*
useQuery is the heart of TanStack Query.
It automatically fetches and caches your data.
*/

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Users() {
  const fetchUsers = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"], // unique identifier for caching
    queryFn: fetchUsers,  // function to fetch data
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>👥 Users List</h2>
      {data.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

/*
✨ Real-life use case:
Imagine you’re building a Zomato “All Restaurants” page.
Each time you visit, you don’t want to refetch if you already have cached data.
TanStack Query caches it automatically!
*/

/////////////////////////////////////////////
// 3️⃣ CACHING & REFETCHING BEHAVIOR
/////////////////////////////////////////////

/*
Caching: TanStack stores fetched data in memory for 5 minutes by default.
So, if you visit the same component again — it loads instantly from cache.

Refetching: You can control when to refetch.
*/

const { data } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 10, // 10 mins - data is considered "fresh"
  cacheTime: 1000 * 60 * 30, // 30 mins - stays in cache
  refetchOnWindowFocus: false, // avoids auto refetch when switching tabs
});

/////////////////////////////////////////////
// 4️⃣ DYNAMIC QUERIES (WITH PARAMETERS)
/////////////////////////////////////////////

/*
Example: Fetch user details based on selected user ID.
*/

function UserDetails({ userId }) {
  const fetchUserById = async (id) => {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // fetch only when userId exists
  });

  if (isLoading) return <p>Loading user details...</p>;

  return <div>{data.name}</div>;
}

/*
💡 Example: In an e-commerce site, when a user clicks a product, 
you fetch that specific product's details dynamically.
*/

/////////////////////////////////////////////
// 5️⃣ MUTATIONS (POST, PUT, DELETE)
/////////////////////////////////////////////

/*
useMutation is used for creating, updating, or deleting data.
It doesn’t cache automatically like useQuery.
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddUser() {
  const queryClient = useQueryClient();

  const addUser = async (newUser) => {
    return axios.post("https://jsonplaceholder.typicode.com/users", newUser);
  };

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // refetch updated list
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({ name: "New User", email: "new@user.com" })
      }
    >
      Add User
    </button>
  );
}

/*
💡 Example: When you submit a form to create a new product or post a review,
you use useMutation. It also automatically refetches the updated list.
*/

/////////////////////////////////////////////
// 6️⃣ OPTIMISTIC UPDATES (Instant UI Update)
/////////////////////////////////////////////

/*
Shows instant UI updates before API confirms (for better UX)
*/

const mutation = useMutation({
  mutationFn: addUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries(["users"]);
    const previousUsers = queryClient.getQueryData(["users"]);

    queryClient.setQueryData(["users"], (old) => [...old, newUser]);

    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(["users"], context.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["users"]);
  },
});

/*
💡 Example: In Instagram, when you “like” a post,
the like count updates immediately (optimistic update) without waiting for API response.
*/

/////////////////////////////////////////////
// 7️⃣ PAGINATION & INFINITE SCROLLING
/////////////////////////////////////////////

/*
Pagination: Load data page by page.
*/

import { useInfiniteQuery } from "@tanstack/react-query";

const fetchUsersPage = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/users?_page=${pageParam}&_limit=5`
  );
  return res.data;
};

function InfiniteUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: fetchUsersPage,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
  });

  return (
    <div>
      {data?.pages.flat().map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}

/*
💡 Example: Like YouTube comment section — loads more comments when scrolled down.
*/

/////////////////////////////////////////////
// 8️⃣ BACKGROUND SYNC & REFRESH
/////////////////////////////////////////////

/*
Automatically refetches data in background (useful for dashboards)
*/

useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  refetchInterval: 5000, // refresh every 5 sec
});

/*
💡 Example: In a stock trading app, data refreshes in background every few seconds.
*/

/////////////////////////////////////////////
// 9️⃣ ERROR HANDLING
/////////////////////////////////////////////

useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  retry: 2, // retry twice before failing
  onError: (error) => {
    console.error("Error fetching users:", error.message);
  },
});

/////////////////////////////////////////////
// 🔟 CUSTOM HOOKS WITH REACT QUERY
/////////////////////////////////////////////

/*
To keep code clean, move fetching logic into custom hooks.
*/

function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      return res.data;
    },
  });
}

function UserList() {
  const { data, isLoading } = useUsers();
  if (isLoading) return <p>Loading...</p>;
  return data.map((u) => <p key={u.id}>{u.name}</p>);
}

/*
💡 Example: In large-scale apps (like Airbnb), you’ll create multiple custom hooks 
like useUsers, useBookings, useRooms — all separated logically.
*/

/////////////////////////////////////////////
// 🔥 SUMMARY
/////////////////////////////////////////////
/*
✅ TanStack Query simplifies everything related to data fetching:
   - Fetching APIs with caching and auto-refetch
   - Mutation with optimistic updates
   - Pagination and infinite scroll
   - Error handling and retry
   - Background sync
   - Works perfectly with Axios and REST APIs or GraphQL

✅ Real-world companies like Netflix, Shopify, and Coinbase use React Query.

💡 Think of TanStack Query as a personal data manager for your app — 
it automatically keeps your data fresh, fast, and in sync with the server.
*/

/////////////////////////////////////////////
// 🚀 ADVANCED PRACTICE IDEAS
/////////////////////////////////////////////
/*
1️⃣ Build a cryptocurrency dashboard — live prices updating every few seconds.
2️⃣ Create a blog app with pagination, CRUD, and optimistic updates.
3️⃣ Make a stock tracker using background refetching and caching.
4️⃣ Build a shopping cart using React Query + useMutation + Context.
*/
*/