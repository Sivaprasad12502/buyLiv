import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";
import './Login.scss'

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");
    setLoading(true);

    try {
      await login(form);
      toast.success("Logged in successfully")
      navigate(redirectTo, { replace: true });
    } catch(error) {
      // console.error("Login failed:", error)
      // setError("Invalid username or password");
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
    >
      <div
        className="login-container"
      >
        <h2 >
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div className="form-group">
            <label >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
             
            />
          </div>

          {/* {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>
              {error}
            </p>
          )} */}

          <button
            type="submit"
            disabled={loading}
            
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
