import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for password visibility toggle

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Track password visibility
  const navigate = useNavigate();

  // Check if the user is already authenticated
  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem("isAuthenticated");
  //   if (isAuthenticated === "true") {
  //     navigate("/");
  //   }
  // }, [navigate]);

  // Memoize error
  const memoizedError = useMemo(() => error, [error]);

  // Password validation function
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasSpecialChar;
  };

  // Handle form submission
  const handleRegister = useCallback(
    (e) => {
      e.preventDefault();

      if (!username || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must contain uppercase, lowercase, and a special character.");
        return;
      }

      const user = { username, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "false");

      alert("Registration successful. Please log in.");
      navigate("/");
    },
    [username, email, password, confirmPassword, navigate]
  );

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 register-container">
      <div className="card p-4 shadow-lg register-card">
        <h2 className="text-center mb-4 register-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control register-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control register-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={passwordVisible ? "text" : "password"} // Toggle visibility
              className="form-control register-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="position-absolute"
              style={{ right: "10px", top: "35px", cursor: "pointer" }}
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control register-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {memoizedError && <div className="text-danger mb-3">{memoizedError}</div>}
          <button type="submit" className="btn btn-primary w-100 py-2 register-btn">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/" className="text-decoration-none text-primary">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
