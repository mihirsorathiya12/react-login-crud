import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 

  // Memoizing the error message to prevent unnecessary re-renders
  const memoizedError = useMemo(() => {
    return error;
  }, [error]);

  // useCallback to memoize handleLogin function
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        setError("No user found. Please register.");
        return;
      }

      if (storedUser.email !== email || storedUser.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", storedUser.username);
      navigate("/dashboard");
    },
    [email, password, navigate] // Memoize the function to avoid unnecessary re-creations
  );

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 login-container">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center mb-4 login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {memoizedError && <div className="text-danger mb-3">{memoizedError}</div>}
          <button type="submit" className="btn btn-primary w-100 py-2 login-btn">
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <a href="/register" className="text-decoration-none text-primary">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
