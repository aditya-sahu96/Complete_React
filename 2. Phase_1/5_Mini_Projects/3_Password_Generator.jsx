// ================================================================
// MINI PROJECT 3: PASSWORD GENERATOR
// ================================================================
//
// Goal: Use multiple states + controlled inputs + conditions.
//
// Features:
// - Select length
// - Choose uppercase, lowercase, numbers, symbols
// - Validate selection
// - Generate random password
// - Copy to clipboard
// ---------------------------------------------------------------

import React, { useState } from "react";

function PasswordGenerator() {
  const [length, setLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Character sets
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+{}[]<>?/";

  // Function to generate password
  const generatePassword = () => {
    let chars = "";
    if (includeUppercase) chars += upper;
    if (includeLowercase) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === "") {
      setError("Please select at least one character type!");
      setPassword("");
      return;
    }

    setError(""); // clear old error
    let generated = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generated += chars[randomIndex];
    }
    setPassword(generated);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert("Password copied!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Password Generator</h1>

      {/* Input Controls */}
      <div style={{ margin: "20px" }}>
        <label>Length: {length}</label>
        <input
          type="range"
          min="4"
          max="20"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={() => setIncludeUppercase(!includeUppercase)}
          />
          Uppercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={() => setIncludeLowercase(!includeLowercase)}
          />
          Lowercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={() => setIncludeSymbols(!includeSymbols)}
          />
          Symbols
        </label>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Buttons */}
      <div style={{ margin: "20px" }}>
        <button onClick={generatePassword}>Generate</button>
        <button onClick={copyToClipboard}>Copy</button>
      </div>

      {/* Display password */}
      {password && (
        <div
          style={{
            margin: "20px auto",
            padding: "10px",
            width: "250px",
            background: "#eee",
          }}
        >
          <strong>{password}</strong>
        </div>
      )}
    </div>
  );
}

export default PasswordGenerator;

// ----------------------------------------------------------------
// Explanation:
//
// • Multiple states manage checkboxes, length, and result.
// • Range input is a controlled component bound to `length`.
// • Validation ensures at least one option is checked.
// • Random character generation uses Math.random().
// • navigator.clipboard API copies password to clipboard.
// • UI updates automatically via React’s reactivity.
// ================================================================
