import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchCart } from "../api/cartApi";
import { fetchProfile } from "../api/profileApi";
import { fetchProductById } from "../api/productApi";
import axiosClient from "../api/axiosClient";
import { MEDIA_BASE_URL } from "../utils/constants";
import "./CheckoutNormal.scss";

export default function CheckoutNormal() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [profile, setProfile] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile().then(setProfile);

    if (productId) {
      fetchProductById(productId).then((p) => {
        setProduct(p);
        setQty(1);
      });
    } else {
      fetchCart().then(setCart);
    }
  }, [productId]);

  const buyNowSubtotal = product && qty > 0 ? Number(product.price) * qty : 0;

  const cartWithSubtotal = cart.map((item) => ({
    ...item,
    subtotal: Number(item.product.price) * Number(item.quantity),
  }));

  const cartTotal = cartWithSubtotal.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const totalAmount = productId ? buyNowSubtotal : cartTotal;

  useEffect(() => {
    if (!productId || !product) return;

    if (qty < 1) setError("Quantity must be at least 1");
    else if (qty > product.stock)
      setError(`Only ${product.stock} items available`);
    else setError("");
  }, [qty, product, productId]);

  const placeOrder = async () => {
    if (error) return;

    try {
      setPlacing(true);
      if (productId) {
        await axiosClient.post("/orders/orders/buynow/", {
          product_id: Number(productId),
          quantity: qty,
        });
      } else {
        await axiosClient.post("/orders/orders/place/", {});
      }
      navigate("/order-success");
    } catch {
      alert("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!profile) return <p>Loading...</p>;
  if(cartWithSubtotal){
    console.log("cartWithsubtotal:",cartWithSubtotal)
  }

  return (
    <MainLayout>
      <div className="checkout">
        {/* LEFT */}
        <div className="checkout__left">
          {profile.profile.address && (
            <div className="checkout__card">
              <h3>Delivery Address</h3>
              <p>
                <strong>{profile.profile.full_name}</strong>
              </p>
              <p>{profile.profile.address}</p>
              <p>
                {profile.profile.city}, {profile.profile.state}
              </p>
              <p>{profile.profile.pincode}</p>
              <p>Phone: {profile.profile.phone}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="checkout__right">
          <div className="checkout__card">
            <h3>Order Summary</h3>

            {productId && product && (
              <div className="checkout__item">
                {product.images?.length > 0 && (
                  <img src={product.images[0].image} alt={product.name} />
                )}

                <div className="checkout__item-info">
                  <strong>{product.name}</strong>
                  <p>{product.short_description}</p>
                  <p>₹{product.price}</p>

                  <div className="checkout__qty">
                    <button onClick={() => qty > 1 && setQty(qty - 1)}>
                      −
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                </div>

                <strong>₹{buyNowSubtotal.toFixed(2)}</strong>
              </div>
            )}

            {!productId &&
              cartWithSubtotal.map((item) => (
                <div key={item.id} className="checkout__item">
                  {item.product.images?.length > 0 && (
                    <img
                      src={`${MEDIA_BASE_URL}${item.product.images[0].image}`}
                      alt={item.product.name}
                    />
                  )}

                  <div className="checkout__item-info">
                    <strong>{item.product.name}</strong>
                    <p>{item.product.short_description}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>

                  <strong>₹{item.subtotal.toFixed(2)}</strong>
                </div>
              ))}

            <div className="checkout__total">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {error && <p className="checkout__error">{error}</p>}

            <button
              className="checkout__btn"
              disabled={placing || !!error}
              onClick={placeOrder}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
