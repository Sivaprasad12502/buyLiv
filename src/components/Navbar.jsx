import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { fetchCart } from "../api/cartApi";
import "./Navbar.scss";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile } from "../api/profileApi";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiHome,
  FiPackage,
  FiLogIn,
  FiTrendingUp,
  FiGitBranch,
  FiLogOut,
  FiSettings,
  FiGrid,
  FiLink,
  FiCreditCard,
  FiInfo,
  FiShoppingBag,
} from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { toast } from "react-toastify";
import { FaHome, FaShoppingBag } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount, search, setSearch } = useAuth();
  const [profile, setProfile] = useState(null);
  const productId = location.pathname.split("/products/")[1] || null;

  useEffect(() => {
    if (!token) return;
    fetchProfile().then((data) => {
      setProfile(data);
    });
  }, [token]);
  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  // window.addEventListener("click", (e) => {
  //   setDropdownOpen(false);
  // });

  return (
    <nav className="navStyle">
      {/* ===== BRAND ===== */}
      <div className="logoStyle" onClick={() => navigate("/")}>
        <span className="logo">B</span>
        <span className="brandName">BuyLiv</span>
      </div>

      {/* ===== SEARCH BOX ===== */}
      {(location.pathname == "/products" || location.pathname == "/") && (
        <div className="searchBox">
          <FiSearch className="searchIcon" />
          <input
            type="text"
            placeholder="Search products..."
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* ===== NAVIGATION LINKS ===== */}
      <div className={`rightSection`}>
        <NavLink to="/" className="navLink ">
          <FiHome className="navIcon" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/products" className="navLink ">
          <FiPackage className="navIcon" />
          <span>
            {location.pathname === `/products/${productId}`
              ? "Product"
              : "Products"}
          </span>
        </NavLink>

        {!token ? (
          <>
            <NavLink to="/about-us" className="navLink ">
              <FiInfo className="navIcon" />
              <span>About Us</span>
            </NavLink>
            <NavLink to="/login" className="navLink loginBtn">
              <FiUser className="navIcon" />
              <span>Login</span>
            </NavLink>
          </>
        ) : (
          <>
            {/* ===== CART WITH BADGE ===== */}
            <NavLink to="/cart" className="navLink cartLink">
              <div className="cartIconWrapper">
                <FiShoppingCart className="navIcon" />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </NavLink>

            {/* <NavLink to="/orders" className="navLink">
              <BsBoxSeam className="navIcon" />
              <span>My Orders</span>
            </NavLink> */}

            {/* ===== USER DROPDOWN ===== */}
            <div
              className="userDropdownWrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`userBtn ${
                  profile?.is_activated ? "activated-user" : ""
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FiUser />
                <span className="username">{profile?.username}</span>
                <span> {profile?.username.charAt(0)}</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown">
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiShoppingBag className="dropdownIcon" />
                    My orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiUser className="dropdownIcon" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiGrid className="dropdownIcon" />
                    Dashboard
                  </Link>
                  <Link
                    to="/referral"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiLink className="dropdownIcon" />
                    Referral Link
                  </Link>
                  <Link
                    to="/tree"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiGitBranch className="dropdownIcon" />
                    Tree View
                  </Link>
                  <Link
                    to="/mlm/requests"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiTrendingUp className="dropdownIcon" />
                    Requests
                  </Link>
                  <Link
                    to="/bankDetails"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiCreditCard className="dropdownIcon" />
                    Bank Details
                  </Link>
                  <Link
                    to="/about-us"
                    onClick={() => setDropdownOpen(false)}
                    className="dropdownItem"
                  >
                    <FiInfo className="dropdownIcon" />
                    About Us
                  </Link>

                  <button onClick={logout} className="dropdownItem logoutBtn">
                    <FiLogOut className="dropdownIcon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
