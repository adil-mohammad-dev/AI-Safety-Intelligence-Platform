import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "adil@example.com",
    password: "123456",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>AI Safety Intelligence Platform</h2>
        <p>Login to monitor incidents and safety analytics</p>

        {error && <p style={styles.error}>{error}</p>}

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
          Login
        </button>
        <button
  type="button"
  style={styles.secondaryButton}
  onClick={() => navigate("/register")}
>
  New user? Create an account
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
    width: "380px",
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
  error: {
    color: "red",
  },
  secondaryButton: {
  padding: "10px",
  border: "none",
  background: "transparent",
  color: "#2563eb",
  cursor: "pointer",
},
};

export default Login;