import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!payload.name || !payload.email || !payload.password) {
      setIsError(true);
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await api.post("/auth/register", payload);

      setIsError(false);
      setMessage("Registration successful. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("Register error:", error.response?.data);

      setIsError(true);

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === "string") {
          setMessage(error.response.data.detail);
        } else {
          setMessage("Registration failed. Please check all fields.");
        }
      } else {
        setMessage("Registration failed. Email may already exist.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Create Account</h2>
        <p>Register to access the AI Safety Intelligence Platform</p>

        {message && (
          <p style={isError ? styles.errorMessage : styles.successMessage}>
            {message}
          </p>
        )}

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button style={styles.button} type="submit">
          Register
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },

  card: {
    width: "390px",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#0f2a44",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
  },

  successMessage: {
    color: "#0f766e",
    background: "#ecfdf5",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  errorMessage: {
    color: "#991b1b",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
  },
};

export default Register;