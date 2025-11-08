// 🧭 PROJECT 3 — FORM VALIDATION
// ---------------------------------------------------------
// Goal: Create a professional-level form with real-time validation.
// We'll handle name, email, and password validation step-by-step.

import React, { useState, useEffect } from "react";

// 🧩 Custom Hook for managing form fields and validation
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // handleChange updates input value
  const handleChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // handleValidation checks for errors
  useEffect(() => {
    setErrors(validate(values));
  }, [values]);

  return { values, errors, handleChange };
}

// Validation Function
const validateForm = values => {
  const errors = {};

  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(values.email))
    errors.email = "Email format invalid";

  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 6)
    errors.password = "Password must be 6+ characters";

  return errors;
};

// Main Component
function FormValidationApp() {
  const { values, errors, handleChange } = useForm(
    { name: "", email: "", password: "" },
    validateForm
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.keys(errors).length === 0)
      alert("✅ Form submitted successfully!");
    else alert("❌ Please fix errors before submitting");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📝 Registration Form</h1>

      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default FormValidationApp;

// 🔍 Professional Notes:
// - useForm() custom hook makes the validation reusable across forms.
// - Regex ensures email pattern correctness.
// - useEffect performs real-time validation on every input change.
// - Object.keys(errors).length === 0 → ensures form validity.
// - Modular pattern allows adding fields without breaking code.
