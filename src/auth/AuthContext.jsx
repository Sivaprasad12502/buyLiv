import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { fetchCart } from "../api/cartApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return setCartCount(0);

      const items = await fetchCart();
      setCartCount(items.length);
    } catch {
      setCartCount(0);
    }
  };

  const login = async (credentials) => {
    const res = await axiosClient.post("/accounts/login/", credentials);

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  useEffect(() => {
    refreshCart(); // ✅ run ONCE on app load
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, login, logout, search, setSearch, cartCount,refreshCart }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
