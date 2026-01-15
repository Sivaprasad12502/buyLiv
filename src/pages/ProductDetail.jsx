import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { fetchProfile } from "../api/profileApi";
import { MEDIA_BASE_URL } from "../utils/constants";
import "./ProductsDetail.scss";
import { useAuth } from "../auth/AuthContext";
import Loading from "../components/Loader/Loading";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [profile, setProfile] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const { refreshCart } = useAuth();

  const token = localStorage.getItem("access_token");

  /* ================= LOAD PRODUCT + PROFILE ================= */
  useEffect(() => {
    fetchProductById(id)
      .then(setProduct)
      .catch(() => navigate("/"));

    if (token) {
      fetchProfile().then(setProfile);
    }
  }, [id, navigate, token]);

  /* ================= ACTIVATION GUARD ================= */
  const requireActivation = () => {
    if (!profile?.is_activated) {
      navigate("/joining-packages");
      return false;
    }
    return true;
  };

  /* ================= ACTIONS ================= */
  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login", { state: { redirectTo: `/products/${id}` } });
      return;
    }

    if (!requireActivation()) return;
    try {
      setLoading(true);
      setError(null);
      await addToCart(product.id, qty);
      refreshCart();
      navigate("/cart");
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        "Failed to add to cart. Please try again.";
      setError(message);
      console.log("add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      navigate("/login", {
        state: { redirectTo: `/checkout/normal/${product.id}` },
      });
      return;
    }

    if (!requireActivation()) return;

    navigate(`/checkout/normal/${product.id}`, {
      state: { quantity: qty },
    });
  };
  console.log("product from productdetail", product);
  
  if (!product) return <Loading />;
  const stock = Number(product?.stock);
  const isOutOfStock = stock <= 0;

  return (
    <MainLayout>
      <div className="product-detail">
        {/* IMAGE SECTION */}
        <div className="product-detail__images">
          <div className="thumbnail-list">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={product.name}
                onClick={() => setMainImage(img.image)}
                className={mainImage === img.image ? "active" : ""}
              />
            ))}
          </div>

          <div className="main-image">
            <img
              src={mainImage || product.images[0]?.image}
              alt={product.name}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="product-detail__info">
          <h1 className="title">{product.name}</h1>
          <p className="price">₹{product.price}</p>

          {product.short_description && (
            <p className="short-desc">{product.short_description}</p>
          )}

          {product.long_description && (
            <div className="description">
              <h4>Description</h4>
              <p>{product.long_description}</p>
            </div>
          )}

          {/* QUANTITY */}
          {/* <div className="quantity">
            <span>Quantity</span>
            <div className="qty-control">
              <button onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            {error && <span>{error}</span>}
          </div> */}

          {/* ACTIONS */}
          <div className="actions">
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={loading}
            >
              Add to Cart
            </button>
            <button
              className="buy-now"
              onClick={handleBuyNow}
              disabled={loading||isOutOfStock }
            >
              {product.stock > 0 ? "Buy Now" : "Out of Stock"}
            </button>
          </div>

          {token && profile && !profile.is_activated && (
            <div className="activation-warning">
              🔒 Please purchase a joining package to activate your account
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= STYLES ================= */
