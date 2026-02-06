import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

import {
  fetchCategories,
  fetchNormalProducts,
  searchProducts,
} from "../../api/productApi";
import { fetchMyOrders } from "../../api/orderApi";
import { getJoiningOrderStatus } from "../../utils/joiningOrder";
import { MEDIA_BASE_URL } from "../../utils/constants";
import MainLayout from "../../layouts/MainLayout";
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import { useAuth } from "../../auth/AuthContext";
import { Footer } from "../../components/Footer/Footer";
import { FaSearch } from "react-icons/fa";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import SearchBar from "../../components/SearchBar/SearchBar";

/* ---------- DUMMY CATEGORY IMAGES ---------- */
// const CATEGORY_IMAGES = {
//   1: "https://static.vecteezy.com/system/resources/previews/046/451/059/large_2x/handcrafted-natural-soaps-with-organic-ingredients-displayed-with-herbs-and-essential-oils-on-rustic-wooden-background-photo.jpg",
//   2: "https://femina.wwmindia.com/content/2018/nov/homemade-hair-care-tips-are-shampooing-depends-on-your-scalp-texture-and-the-nature-of-your-hair.jpg",
//   3: "https://cdn.pixabay.com/photo/2024/03/11/14/31/ai-generated-8626807_640.png",
//   4: "https://cdn.stocksnap.io/img-thumbs/960w/health-care_0DCSAGJ9CM.jpg",
//   5: "https://cdn.pixabay.com/photo/2023/10/01/14/40/medicine-8287535_1280.jpg",
//   6: "https://www.pngall.com/wp-content/uploads/4/Grocery-PNG-Clipart.png",
// };

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [joiningStatus, setJoiningStatus] = useState(null);

  const { search,setSearch  } = useAuth();
  const [searching, setSearching] = useState(false);
  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerpage = 4;

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
  //Pagination calculations
  const indexOfLastItem = currentPage * itemsPerpage;
  const indexOfFirstItem = indexOfLastItem - itemsPerpage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handleNextPage = () => {
    if (indexOfLastItem < filteredProducts.length) {
      setCurrentPage((prev) => prev + 1);
      // window.scrollTo(0,0)
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      // window.scrollTo(0,0)
    }
  };
  return (
    <MainLayout>
      {/* ================= HERO ================= */}
       <SearchBar/>
      
      <HeroSlider />

      {/* ================= CATEGORIES ================= */}
      <section className="section">
        <h2>SHOP BY CATEGORY</h2>

        <div className="categoryGrid">
          <CategoryCard
            label="All"
            // image="https://images.unsplash.com/photo-1472851294608-062f824d29cc"
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
      <section className="productSection">
        <h2>Products</h2>

        {searching && <p style={{ color: "#777" }}>Searching...</p>}

        {!searching && filteredProducts.length === 0 && (
          <p style={{ color: "#777", textAlign: "center" }}>
            No products found.
          </p>
        )}

        <div className="productGrid">
          {currentProducts?.map((p) => (
            <div
              key={p.id}
              className="productCard"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <ImageSlider images={p.images} name={p.name} />

              <div className="productInfo">
                <h4>{p.name}</h4>
                <p style={{ fontWeight: "700" }}>{p.price}</p>
                <span>{p.long_description}</span>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length > itemsPerpage && (
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage == 1}>
                 ‹
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredProducts.length / itemsPerpage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={indexOfLastItem >= filteredProducts.length}
            >
                 ›
            </button>
          </div>
        )}
      </section>

      {/* ================= JOINING CTA ================= */}
      {joiningStatus !== "DELIVERED" && (
        <section className="ctaSection">
          <h2>Joining Package</h2>
          <p >
            Required to activate your account and unlock earnings.
          </p>

          {joiningStatus === null && (
            <button className="ctaButton" onClick={handleJoinClick}>
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
      className="categoryCard"
      style={{
        border: active ? "2px solid #38ef7d" : "1px solid #38ef7d",
        background: active ? "  linear-gradient(135deg, #38ef7d 0%, #11998e 100%)" : "#fff",
        color: active ? "#fff" : "#000",
      }}
    >
      {/* <img src={image} alt={label} className="categoryImage" /> */}
      <div className="categoryLabel">{label}</div>
    </div>
  );
}

/* ================= STYLES ================= */

// const hero = { textAlign: "center", padding: "50px 20px" };
// const heroTitle = { fontSize: "34px", marginBottom: "10px" };
// const heroSubtitle = { color: "#555" };
// const searchBox = {
//   marginTop: "20px",
//   display: "flex",
//   justifyContent: "center",
// };
// const searchInput = {
//   width: "100%",
//   maxWidth: "420px",
//   padding: "12px 16px",
//   borderRadius: "8px",
//   border: "1px solid #ddd",
// };

// const section = { marginTop: "50px" };
// const sectionTitle = { marginBottom: "20px" };
// const categoryGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//   gap: "20px",
// };
// const categoryCard = {
//   cursor: "pointer",
//   borderRadius: "10px",
//   overflow: "hidden",
//   background: "#fff",
// };
// const categoryImage = { width: "100%", height: "120px", objectFit: "cover" };
// const categoryLabel = {
//   padding: "10px",
//   textAlign: "center",
//   fontWeight: "600",
// };

// const productGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//   gap: "28px",
// };
// const productCard = {
//   cursor: "pointer",
//   background: "#fff",
//   border: "1px solid #e5e5e5",
//   borderRadius: "10px",
//   overflow: "hidden",
// };
// const productImage = { width: "100%", height: "200px", objectFit: "cover" };
// const productInfo = { padding: "16px" };

// const ctaSection = {
//   marginTop: "70px",
//   padding: "40px",
//   background: "#f9fafb",
//   borderRadius: "12px",
//   textAlign: "center",
// };
// const ctaButton = {
//   marginTop: "15px",
//   padding: "12px 22px",
//   background: "#000",
//   color: "#fff",
//   borderRadius: "6px",
//   border: "none",
//   cursor: "pointer",
// };
