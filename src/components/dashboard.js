import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/");
    } else {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, [navigate]);

  const memoizedUsername = useMemo(() => username, [username]);

  const handleLogout = useCallback(() => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("username");
    navigate("/");
  }, [navigate]);

  const toggleLogoutMenu = () => {
    setShowLogout(!showLogout);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    phone: "",
    gender: "",
    terms: false,
    country: "",
  });
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Phone number validation: only allow digits and limit it to 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: numericValue, // update only with digits and up to 10
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = useCallback(() => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.phone) validationErrors.phone = "Phone is required";
    if (!formData.date) validationErrors.date = "Date is required";
    if (!formData.gender) validationErrors.gender = "Gender is required";
    if (!formData.country) validationErrors.country = "Country is required";
    if (!formData.terms) validationErrors.terms = "You must accept the terms";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = formData;
      setData(updatedData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setData([...data, formData]);
    }
    setFormData({
      name: "",
      email: "",
      date: "",
      phone: "",
      gender: "",
      terms: false,
      country: "",
    });
  }, [data, formData, isEditing, editIndex]);

  const handleEdit = useCallback(
    (index) => {
      setFormData(data[index]);
      setIsEditing(true);
      setEditIndex(index);
    },
    [data]
  );

  const handleDelete = useCallback(
    (index) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this item?");
      if (isConfirmed) {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
      }
    },
    [data]
  );

  const handleView = (index) => {
    alert(`Name: ${data[index].name}\nEmail: ${data[index].email}`);
  };

  return (
    <div>
      {/* Navbar Section with Username */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Dashboard
          </a>
          <div className="d-flex">
            {/* Username display */}
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="usernameDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={toggleLogoutMenu}
              >
                {memoizedUsername}
              </button>
              <ul
                className={`dropdown-menu ${showLogout ? "show" : ""}`}
                aria-labelledby="usernameDropdown"
              >
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="container my-4">
        <h4 className="text-center mb-4">React CRUD Operation</h4>

        <div className="form-container">
          {/* Name Input */}
          <div className="mb-3">
            <label className="form-label">Enter Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label">Enter Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Date Input */}
          <div className="mb-3">
            <label className="form-label">Enter Date</label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Phone Number Input */}
          <div className="mb-3">
            <label className="form-label">Enter Phone Number</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          {/* Gender Input */}
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <div>
              <label className="form-check-label me-3">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="form-check-input"
                />
                Male
              </label>
              <label className="form-check-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="form-check-input"
                />
                Female
              </label>
            </div>
            {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
          </div>

          {/* Terms Input */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label className="form-check-label">I accept the terms and conditions</label>
            {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
          </div>

          {/* Country Input */}
          <div className="mb-3">
            <label className="form-label">Country</label>
            <select
              className={`form-select ${errors.country ? "is-invalid" : ""}`}
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="INDIA">India</option>
              <option value="Canada">Canada</option>
              <option value="USA">USA</option>
            </select>
            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary w-100"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            {isEditing ? "Update" : "Submit"}
          </button>
        </div>

        {/* Data List Section - Display submitted data */}
        <div className="mt-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="data-item mb-3 p-3 border rounded shadow-sm">
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Email:</strong> {item.email}
                </div>
                <div>
                  <strong>Phone:</strong> {item.phone}
                </div>
                <div>
                  <strong>Date:</strong> {item.date}
                </div>
                <div>
                  <strong>Gender:</strong> {item.gender}
                </div>
                <div>
                  <strong>Country:</strong> {item.country}
                </div>
                <div className="mt-2">
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleView(index)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
