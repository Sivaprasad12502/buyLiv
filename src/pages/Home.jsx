import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  fetchCategories,
  fetchNormalProducts,
  searchProducts,
} from "../api/productApi";
import { fetchMyOrders } from "../api/orderApi";
import { getJoiningOrderStatus } from "../utils/joiningOrder";
import { MEDIA_BASE_URL } from "../utils/constants";
import { Footer } from "../components/Footer/Footer";

/* ---------- DUMMY CATEGORY IMAGES ---------- */
const CATEGORY_IMAGES = {
  1: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
  2: "https://images.unsplash.com/photo-1542838132-92c53300491e",
  3: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
  4: "https://images.unsplash.com/photo-1514995669114-6081e934b693",
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [joiningStatus, setJoiningStatus] = useState(null);

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchCategories().then((data) => {
      const filtered = data.filter(
        (cat) =>
          cat.name.toLowerCase() !== "joining" &&
          cat.name.toLowerCase() !== "joining package"
      );
      setCategories(filtered);
    });

    fetchNormalProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });

    if (token) {
      fetchMyOrders().then((orders) => {
        setJoiningStatus(getJoiningOrderStatus(orders));
      });
    } else {
      setJoiningStatus(null);
    }
  }, [token]);

  /* ================= SEARCH (BACKEND) ================= */
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(
        activeCategory === "ALL"
          ? products
          : products.filter((p) => p.category === activeCategory)
      );
      return;
    }

    const delay = setTimeout(() => {
      setSearching(true);
      searchProducts(search)
        .then((data) => {
          const scoped =
            activeCategory === "ALL"
              ? data
              : data.filter((p) => p.category === activeCategory);

          setFilteredProducts(scoped);
        })
        .finally(() => setSearching(false));
    }, 400);

    return () => clearTimeout(delay);
  }, [search, activeCategory, products]);

  /* ================= CATEGORY FILTER ================= */
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearch("");

    setFilteredProducts(
      categoryId === "ALL"
        ? products
        : products.filter((p) => p.category === categoryId)
    );
  };

  /* ================= JOINING CTA ================= */
  const handleJoinClick = () => {
    if (!token) {
      navigate("/login", { state: { redirectTo: "/joining-packages" } });
      return;
    }
    navigate("/joining-packages");
  };

  return (
    <MainLayout>
      {/* ================= HERO ================= */}
      <section style={hero}>
        <h1 style={heroTitle}>Welcome to BuyLiv</h1>
        <p style={heroSubtitle}>
          Premium products. Trusted network. Sustainable income.
        </p>

        <div style={searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section style={section}>
        <h2 style={sectionTitle}>Shop by Category</h2>

        <div style={categoryGrid}>
          <CategoryCard
            label="All"
            image="https://images.unsplash.com/photo-1472851294608-062f824d29cc"
            active={activeCategory === "ALL"}
            onClick={() => handleCategoryClick("ALL")}
          />

          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              label={cat.name}
              // image={
              //   CATEGORY_IMAGES[cat.id] ||
              //   "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
              // }
              active={activeCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section style={section}>
        <h2 style={sectionTitle}>Products</h2>

        {searching && <p style={{ color: "#777" }}>Searching...</p>}

        {!searching && filteredProducts.length === 0 && (
          <p style={{ color: "#777" }}>No products found.</p>
        )}

        <div style={productGrid}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={productCard}
              onClick={() => navigate(`/products/${p.id}`)}
            >
              {p.image && (
                <img
                  src={`${MEDIA_BASE_URL}${p.image}`}
                  alt={p.name}
                  style={productImage}
                />
              )}

              <div style={productInfo}>
                <h4>{p.name}</h4>
                <p style={{ fontWeight: "700" }}>₹{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= JOINING CTA ================= */}
      {joiningStatus !== "DELIVERED" && (
        <section style={ctaSection}>
          <h2>Joining Package</h2>
          <p style={{ color: "#555" }}>
            Required to activate your account and unlock earnings.
          </p>

          {joiningStatus === null && (
            <button style={ctaButton} onClick={handleJoinClick}>
              Buy Joining Package
            </button>
          )}

          {joiningStatus === "PENDING" && (
            <p style={{ color: "#b45309" }}>
              ⏳ Your joining package is pending admin delivery.
            </p>
          )}
        </section>
      )}
     
    </MainLayout>
  );
}

/* ================= COMPONENTS ================= */

function CategoryCard({ label, image, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...categoryCard,
        border: active ? "2px solid #000" : "1px solid #e5e5e5",
      }}
    >
      <img src={image} alt={label} style={categoryImage} />
      <div style={categoryLabel}>{label}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const hero = { textAlign: "center", padding: "50px 20px" };
const heroTitle = { fontSize: "34px", marginBottom: "10px" };
const heroSubtitle = { color: "#555" };
const searchBox = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
};
const searchInput = {
  width: "100%",
  maxWidth: "420px",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const section = { marginTop: "50px" };
const sectionTitle = { marginBottom: "20px" };
const categoryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "20px",
};
const categoryCard = {
  cursor: "pointer",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#fff",
};
const categoryImage = { width: "100%", height: "120px", objectFit: "cover" };
const categoryLabel = {
  padding: "10px",
  textAlign: "center",
  fontWeight: "600",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "28px",
};
const productCard = {
  cursor: "pointer",
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: "10px",
  overflow: "hidden",
};
const productImage = { width: "100%", height: "200px", objectFit: "cover" };
const productInfo = { padding: "16px" };

const ctaSection = {
  marginTop: "70px",
  padding: "40px",
  background: "#f9fafb",
  borderRadius: "12px",
  textAlign: "center",
};
const ctaButton = {
  marginTop: "15px",
  padding: "12px 22px",
  background: "#000",
  color: "#fff",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};
