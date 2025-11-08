// 🌐 PHASE 5: ROUTING & NAVIGATION (React Router v6+)
// -----------------------------------------------------
// This section explains routing in React step-by-step in a complete professional manner.
// Routing allows navigation between different pages without reloading the browser.

// -----------------------------------------------------
// 1. INSTALLATION AND SETUP
// -----------------------------------------------------
// React Router is a library that helps manage navigation between components (pages).
// Install using npm or yarn:
// npm install react-router-dom
// OR
// yarn add react-router-dom

// -----------------------------------------------------
// 2. PROJECT STRUCTURE EXAMPLE
// -----------------------------------------------------
// src/
// ├── App.jsx
// ├── index.js
// ├── pages/
// │   ├── Home.jsx
// │   ├── About.jsx
// │   ├── Contact.jsx
// ├── components/
// │   ├── Navbar.jsx

// -----------------------------------------------------
// 3. BASIC ROUTING SETUP (BrowserRouter, Routes, Route)
// -----------------------------------------------------
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Home = () => <h2>🏠 Home Page</h2>;
const About = () => <h2>ℹ️ About Page</h2>;
const Contact = () => <h2>📞 Contact Page</h2>;

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Links */}
      <nav style={{ display: "flex", gap: "1rem", background: "#eee", padding: "10px" }}>
        {/* Link component helps navigate without reloading */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Routes define which component to render for a specific path */}
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// <BrowserRouter> wraps the entire application and enables routing.
// <Routes> holds all route definitions.
// <Route path="/about" element={<About />} /> means when user visits "/about", render About component.
// <Link> changes the URL and updates UI instantly without full reload.

// -----------------------------------------------------
// 4. NAVIGATION WITH NavLink AND useNavigate HOOK
// -----------------------------------------------------
// NavLink is similar to Link but can show "active" style when a route is active.

import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{ display: "flex", gap: "1rem", background: "#f0f0f0", padding: "10px" }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? "blue" : "black",
          fontWeight: isActive ? "bold" : "normal",
        })}
      >
        Home
      </NavLink>

      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>

      {/* Programmatic navigation */}
      <button onClick={() => navigate("/about")}>Go to About</button>
    </nav>
  );
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// useNavigate() is a hook that lets you redirect programmatically (like navigate("/login")).
// NavLink auto-detects current route and allows styling active link dynamically.

// -----------------------------------------------------
// 5. NESTED ROUTES (Parent-Child Structure)
// -----------------------------------------------------
// Suppose we have a Dashboard with nested pages (Profile, Settings).

import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <Link to="profile">Profile</Link>{" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet /> {/* Child components will render here */}
    </div>
  );
}

function Profile() {
  return <h3>User Profile</h3>;
}
function Settings() {
  return <h3>Account Settings</h3>;
}

function AppNestedRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested Routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// <Outlet /> acts as a placeholder where nested child components will appear.
// So when user visits "/dashboard/profile", both Dashboard and Profile render together.

// -----------------------------------------------------
// 6. DYNAMIC ROUTES & URL PARAMETERS
// -----------------------------------------------------
// Used when a route depends on a variable (like user ID or product ID).

import { useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams(); // extract parameter from URL
  return <h2>Profile of User ID: {userId}</h2>;
}

function AppDynamicRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// /user/101 → userId = 101
// /user/xyz → userId = xyz
// useParams() reads variables from dynamic paths.

// -----------------------------------------------------
// 7. PROTECTED ROUTES (AUTHENTICATION)
// -----------------------------------------------------
// Used to restrict access to pages unless user is authenticated.

import { Navigate } from "react-router-dom";

const isAuthenticated = false; // Example

function PrivateRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function DashboardPage() {
  return <h2>Welcome to your dashboard</h2>;
}

function AppProtected() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<h2>Please Login</h2>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// <Navigate> is used to redirect user to another page if a condition fails.
// PrivateRoute checks if user is logged in, otherwise navigates to /login.

// -----------------------------------------------------
// 8. LAZY LOADING & CODE SPLITTING
// -----------------------------------------------------
// Helps load only the code required for a specific route → improves performance.

import React, { Suspense, lazy } from "react";
const HomeLazy = lazy(() => import("./Home"));
const AboutLazy = lazy(() => import("./About"));

function AppLazy() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h2>Loading...</h2>}>
        <Routes>
          <Route path="/" element={<HomeLazy />} />
          <Route path="/about" element={<AboutLazy />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// lazy() dynamically loads components when the route is visited.
// <Suspense fallback> shows a temporary loading UI while component loads.

// -----------------------------------------------------
// 9. SCROLL RESTORATION
// -----------------------------------------------------
// React Router doesn't automatically scroll to top when changing routes.
// You can manually control it using useEffect and useLocation.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// -----------------------------------------------------
// EXPLANATION:
// -----------------------------------------------------
// Whenever route path (pathname) changes, window scrolls to top.
// This ensures a clean user experience when switching pages.

// -----------------------------------------------------
// ✅ SUMMARY
// -----------------------------------------------------
// 1. BrowserRouter enables routing in React apps.
// 2. Routes and Route define paths and components.
// 3. Link/NavLink navigate without reloading page.
// 4. useNavigate allows programmatic navigation.
// 5. Outlet enables nested route rendering.
// 6. useParams handles dynamic routes.
// 7. PrivateRoute secures sensitive routes.
// 8. lazy() + Suspense enables route-based code splitting.
// 9. Scroll restoration maintains user experience.

// -----------------------------------------------------
// 🧠 PROFESSIONAL TIP:
// -----------------------------------------------------
// - Organize routes separately in a `routes.js` file for cleaner code.
// - Use route-based lazy loading for large apps.
// - Always define a fallback route (404 page).
// - Use nested routes to structure dashboards or admin panels efficiently.
