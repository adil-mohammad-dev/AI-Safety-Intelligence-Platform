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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);
      setMessage("Registration successful. Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage("Registration failed. Email may already exist.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Create Account</h2>
        <p>Register to access the AI Safety Intelligence Platform</p>

        {message && <p style={styles.message}>{message}</p>}

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
  message: {
    color: "#0f766e",
  },
};

export default Register;