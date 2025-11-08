// 🎨 PHASE 6: STYLING & UI DEVELOPMENT (3–4 Weeks)
// -----------------------------------------------------
// In this phase, we’ll learn every styling method used in professional React apps.
// We’ll start from basic CSS Modules → Styled Components → Tailwind → UI Libraries → Advanced Styling.
// -----------------------------------------------------


/* -----------------------------------------------------
1️⃣ CSS MODULES
------------------------------------------------------ */
// CSS Modules help you write modular, scoped CSS. 
// Instead of global styles, each CSS file affects only its component.


// ✅ File: Button.module.css
.button {
  background-color: royalblue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.button:hover {
  background-color: dodgerblue;
}


// ✅ File: Button.jsx
import React from "react";
import styles from "./Button.module.css"; // imported as object

function Button({ label }) {
  return <button className={styles.button}>{label}</button>;
}
export default Button;


// 🧠 Explanation:
// - `import styles from "./Button.module.css"` gives a unique name to each class (like Button_button__x1d2f).
// - Prevents class name conflicts.
// - Great for small to medium projects.
// -----------------------------------------------------



/* -----------------------------------------------------
2️⃣ STYLED COMPONENTS
------------------------------------------------------ */
// It allows writing actual CSS in JS files.
// Each styled component is a real React component with encapsulated styles.

// Install: npm install styled-components

import styled from "styled-components";

const StyledButton = styled.button`
  background-color: teal;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: darkcyan;
  }
`;

function StyledComponentExample() {
  return <StyledButton>Click Me</StyledButton>;
}

export default StyledComponentExample;


// 🧠 Explanation:
// - styled-components use tagged template literals for CSS.
// - Supports dynamic styling using props.
// - It automatically generates class names to avoid conflicts.


// ✅ Dynamic styling example
const DynamicButton = styled.button`
  background: ${(props) => (props.primary ? "royalblue" : "gray")};
  color: white;
  padding: 8px 16px;
`;

function DynamicExample() {
  return (
    <>
      <DynamicButton primary>Primary</DynamicButton>
      <DynamicButton>Secondary</DynamicButton>
    </>
  );
}
// -----------------------------------------------------



/* -----------------------------------------------------
3️⃣ EMOTION
------------------------------------------------------ */
// Emotion is similar to styled-components but lighter and faster.
// Install: npm install @emotion/react @emotion/styled

import styled from "@emotion/styled";

const EmotionButton = styled.button`
  background-color: tomato;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;

  &:hover {
    background-color: crimson;
  }
`;

export default function EmotionExample() {
  return <EmotionButton>Emotion Styled Button</EmotionButton>;
}

// 🧠 Note: Emotion and styled-components are nearly identical in syntax.
// - Emotion is more lightweight and faster.
// - Both support theme customization and props-based styling.
// -----------------------------------------------------



/* -----------------------------------------------------
4️⃣ TAILWIND CSS
------------------------------------------------------ */
// Tailwind CSS uses utility classes directly in JSX to style components.
// It allows very fast UI building with a consistent design system.

// Install:
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

// Configure tailwind.config.js with your src folder.

import React from "react";

function TailwindExample() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Tailwind CSS Example</h1>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Click Me
      </button>
    </div>
  );
}

export default TailwindExample;

// 🧠 Explanation:
// - Tailwind generates utility classes like `bg-blue-600`, `p-4`, `text-xl`.
// - It removes the need for writing custom CSS files.
// - Excellent for fast development and consistent design.
// -----------------------------------------------------



/* -----------------------------------------------------
5️⃣ CSS-IN-JS (Pros & Cons)
------------------------------------------------------ */
// CSS-in-JS refers to libraries like styled-components or Emotion where styles live inside JS files.

// ✅ Pros:
// - Scoped and modular styles
// - Dynamic styling using props
// - Easy theme integration
// - No class name conflicts

// ❌ Cons:
// - Slight runtime performance cost (especially for very large apps)
// - Harder to separate styling from logic
// - Bigger bundle size compared to CSS Modules
// -----------------------------------------------------



/* -----------------------------------------------------
6️⃣ MATERIAL UI (MUI)
------------------------------------------------------ */
// MUI is one of the most used UI libraries for React.
// Install: npm install @mui/material @emotion/react @emotion/styled

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function MUIExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem" }}>
      <TextField label="Enter Name" variant="outlined" />
      <Button variant="contained" color="primary">
        Submit
      </Button>
    </div>
  );
}

export default MUIExample;

// 🧠 Explanation:
// - MUI gives you pre-built, accessible components.
// - Comes with built-in theme customization, dark mode, and responsive grid system.
// -----------------------------------------------------



/* -----------------------------------------------------
7️⃣ CHAKRA UI
------------------------------------------------------ */
// Another popular component library focused on simplicity and accessibility.
// Install: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

import { ChakraProvider, Box, Button, Text } from "@chakra-ui/react";

function ChakraExample() {
  return (
    <ChakraProvider>
      <Box bg="purple.500" color="white" p={6} borderRadius="md" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">Chakra UI Example</Text>
        <Button mt={4} colorScheme="teal">
          Click Me
        </Button>
      </Box>
    </ChakraProvider>
  );
}

export default ChakraExample;

// 🧠 Explanation:
// - Chakra UI provides pre-styled components with props-based design.
// - Easily handles responsive design and color themes.
// - Built on top of Emotion (CSS-in-JS).
// -----------------------------------------------------



/* -----------------------------------------------------
8️⃣ ANT DESIGN
------------------------------------------------------ */
// Ant Design is a professional-grade enterprise UI framework.
// Install: npm install antd

import { Button as AntButton, Input } from "antd";
import "antd/dist/reset.css";

function AntExample() {
  return (
    <div style={{ padding: "2rem" }}>
      <Input placeholder="Type something..." style={{ width: "200px", marginRight: "10px" }} />
      <AntButton type="primary">Submit</AntButton>
    </div>
  );
}

export default AntExample;

// 🧠 Explanation:
// - Ant Design focuses on large-scale enterprise applications.
// - Provides extensive layout and data display components.
// - Heavier than MUI or Chakra but very powerful.
// -----------------------------------------------------



/* -----------------------------------------------------
9️⃣ ADVANCED STYLING TECHNIQUES
------------------------------------------------------ */

// ✅ Theming & Dark Mode (using Styled Components Example)
import { ThemeProvider } from "styled-components";

const lightTheme = { bg: "#fff", color: "#000" };
const darkTheme = { bg: "#000", color: "#fff" };

const ThemedContainer = styled.div`
  background-color: ${(p) => p.theme.bg};
  color: ${(p) => p.theme.color};
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
`;

function ThemeExample() {
  const [dark, setDark] = React.useState(false);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <ThemedContainer>
        <h2>{dark ? "Dark Mode 🌙" : "Light Mode ☀️"}</h2>
        <button onClick={() => setDark(!dark)}>Toggle Theme</button>
      </ThemedContainer>
    </ThemeProvider>
  );
}

// 🧠 Explanation:
// - ThemeProvider provides theme data to styled components.
// - Styles update automatically when theme changes.

// ✅ Responsive Design (Tailwind)
function ResponsiveTailwind() {
  return (
    <div className="p-8 bg-gray-200">
      <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-blue-700">
        Responsive Tailwind Example
      </h1>
      <p className="text-sm md:text-base lg:text-lg">
        Resize your browser to see font size and layout change!
      </p>
    </div>
  );
}

// ✅ CSS Variables & Dynamic Styling
// Define variables in CSS and update them using JS.

const DynamicBox = styled.div`
  --main-bg: lightcoral;
  background-color: var(--main-bg);
  color: white;
  padding: 20px;
  border-radius: 10px;
`;

function CSSVariableExample() {
  const [color, setColor] = React.useState("lightcoral");
  return (
    <>
      <input
        type="color"
        onChange={(e) => setColor(e.target.value)}
        value={color}
        style={{ marginBottom: "10px" }}
      />
      <DynamicBox style={{ "--main-bg": color }}>
        Dynamic Background Color
      </DynamicBox>
    </>
  );
}

// -----------------------------------------------------
// ✅ SUMMARY
// -----------------------------------------------------
// 1. CSS Modules → Scoped local CSS
// 2. Styled-components & Emotion → CSS-in-JS with dynamic styles
// 3. Tailwind CSS → Utility-first, fast development
// 4. MUI / Chakra / Ant Design → Ready-made UI kits
// 5. Theming → Dark mode & global color control
// 6. Responsive design → Tailwind or media queries
// 7. Dynamic styling → CSS variables or props

// -----------------------------------------------------
// 🧠 PROFESSIONAL TIPS
// -----------------------------------------------------
// - For enterprise-grade apps → MUI or Ant Design
// - For startups or small projects → Tailwind + custom components
// - For fine control → Styled-components + ThemeProvider
// - Always use design tokens (color, font, spacing) for scalability
// - Keep all style decisions consistent through a design system
