import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiShoppingBag,
  FiShield,
  FiZap,
  FiHeart
} from "react-icons/fi";
import { BiLogInCircle } from "react-icons/bi";
import "./Login.scss";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Logged in successfully");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Section - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="logo-section">
              <FiShoppingBag className="main-logo" />
              <h1>BuyLiv</h1>
            </div>
            
            <h2>Welcome !</h2>
            <p className="tagline">Log in to continue shopping and manage your orders</p>
            
            <div className="features">
              <div className="feature-item">
                <FiShield className="feature-icon" />
                <div>
                  <h4>Secure Shopping</h4>
                  <p>Your data is protected</p>
                </div>
              </div>
              
              <div className="feature-item">
                <FiZap className="feature-icon" />
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Quick & reliable shipping</p>
                </div>
              </div>
              
              <div className="feature-item">
                <FiHeart className="feature-icon" />
                <div>
                  <h4>Best Deals</h4>
                  <p>Exclusive offers for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-container">
          <div className="login-card">
            <div className="card-header">
              <BiLogInCircle className="login-icon" />
              <h2>Log In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">
                  <FiUser className="label-icon" />
                  Username
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FiLock className="label-icon" />
                  Password
                </label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

             
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Loging in...
                  </>
                ) : (
                  <>
                    <BiLogInCircle />
                    Log In
                  </>
                )}
              </button>
            </form>

            

           
          </div>

          <div className="login-footer">
            <p>&copy; 2026 BuyLiv. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
