import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  fetchNormalProducts,
  fetchCategories,
  searchProducts,
} from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { fetchProfile } from "../api/profileApi";
import { MEDIA_BASE_URL } from "../utils/constants";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import "./Products.scss";
import { useAuth } from "../auth/AuthContext";
import SearchBar from "../components/SearchBar/SearchBar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const [searching, setSearching] = useState(false);

  const [profile, setProfile] = useState(null);
  const { refreshCart, search, setSearch } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchNormalProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });

    fetchCategories().then((data) => {
      const filtered = data.filter(
        (cat) =>
          cat.name.toLowerCase() !== "joining" &&
          cat.name.toLowerCase() !== "joining package"
      );
      setCategories(filtered);
    });

    if (token) {
      fetchProfile().then(setProfile);
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
        .then(setFilteredProducts)
        .finally(() => setSearching(false));
    }, 400);

    return () => clearTimeout(delay);
  }, [search, activeCategory, products]);

  /* ================= CATEGORY FILTER ================= */
  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setSearch("");

    setFilteredProducts(
      categoryId === "ALL"
        ? products
        : products.filter((p) => p.category === categoryId)
    );
  };

  /* ================= ACTIVATION GUARD ================= */
  const requireActivation = () => {
    if (!profile?.is_activated) {
      navigate("/joining-packages");
      return false;
    }
    return true;
  };

  /* ================= CART / BUY ================= */
  const handleAddToCart = async (productId) => {
    if (!token) {
      navigate("/login", { state: { redirectTo: "/products" } });
      return;
    }

    if (!requireActivation()) return;

    await addToCart(productId, 1);
    refreshCart();
    navigate("/cart");
  };

  const handleBuyNow = (productId) => {
    if (!token) {
      navigate("/login", {
        state: { redirectTo: `/checkout/normal/${productId}` },
      });
      return;
    }

    if (!requireActivation()) return;

    navigate(`/checkout/normal/${productId}`);
  };

  return (
    <MainLayout>
      <div className="products-page">
        {/* <h2>All Products</h2> */}
        <SearchBar />

        <div className="products-layout">
          <aside className="filter-box">
            <h4>Categories</h4>

            <FilterItem
              active={activeCategory === "ALL"}
              onClick={() => handleCategoryFilter("ALL")}
              label="All Products"
            />

            {categories.map((cat) => (
              <FilterItem
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                label={cat.name}
              />
            ))}
          </aside>

          <div>
            <div className="products-grid">
              {filteredProducts.length == 0 && (
                <p style={{display:"flex",alignItems:"center",justifyContent:'center',height:"50vh", color: "#777", textAlign: "center" }}>
                  No products found.
                </p>
              )}
              {filteredProducts.map((p) => (
                <div className="product-card" key={p.id}>
                  <ImageSlider images={p.images} name={p.name} />

                  <div className="product-info">
                    <h4 onClick={() => navigate(`/products/${p.id}`)}>
                      {p.name}
                    </h4>
                    <p className="price">₹{p.price}</p>
                    <span>{p.long_description}</span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="add-cart"
                      onClick={() => handleAddToCart(p.id)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="buy-now"
                      onClick={() => handleBuyNow(p.id)}
                    >
                      Buy Now
                    </button>
                  </div>

                  {token && profile && !profile.is_activated && (
                    <div className="activation-warning">
                      🔒 Activate account to purchase
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= REUSABLE ================= */

function FilterItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        // borderRadius: "6px",
        cursor: "pointer",
        background: active
          ? " linear-gradient(135deg, #38ef7d 0%, #11998e 100%)"
          : "transparent",
        color: active ? "#fff" : "#333",
        marginBottom: "6px",
      }}
    >
      {label}
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const layout = {
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  gap: "30px",
};

const filterBox = {
  border: "1px solid #e5e5e5",
  borderRadius: "10px",
  padding: "16px",
  background: "#fff",
};

const searchInput = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "15px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "28px",
};

const card = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: "10px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  cursor: "pointer",
};

const info = {
  padding: "14px 16px",
  flexGrow: 1,
};

const name = {
  marginBottom: "6px",
  cursor: "pointer",
};

const price = {
  fontWeight: "700",
  fontSize: "16px",
};

const actions = {
  display: "flex",
  gap: "10px",
  padding: "14px 16px",
  borderTop: "1px solid #eee",
};

const addToCartBtn = {
  flex: 1,
  padding: "10px",
  border: "1px solid #000",
  background: "#fff",
  cursor: "pointer",
  borderRadius: "6px",
};

const buyNowBtn = {
  flex: 1,
  padding: "10px",
  border: "none",
  background: "#000",
  color: "#fff",
  cursor: "pointer",
  borderRadius: "6px",
};
