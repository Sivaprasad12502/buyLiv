import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile } from "../api/profileApi";
import { buyJoiningPackage } from "../api/orderApi";
import "./CheckoutJoining.scss";

export default function CheckoutJoining() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  console.log("checkout joining product:", product);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  const placeOrder = async () => {
    await buyJoiningPackage(product.id, 1);
    alert("Order placed. Waiting for admin approval.");
    navigate("/");
  };
  console.log("profile in checkout joining:", profile);
  if (!profile) return <p className="checkout-loading">Loading...</p>;

  return (
    <MainLayout>
      <div className="checkout-wrapper">
        <h2 className="checkout-title">Checkout</h2>

        <div className="checkout-grid">
          {/* LEFT: Address */}
          {profile.profile.address && (
            <div className="checkout-card">
              <h3>Delivery Address</h3>

              <div className="address-box">
                <p className="name">{profile.profile.full_name}</p>
                <p>{profile.profile.address}</p>
                <p>
                  {profile.profile.city} {profile.profile.state}
                </p>
              </div>
            </div>
          )}

          {/* RIGHT: Order Summary */}
          <div className="checkout-card summary-card">
            <h3>Order Summary</h3>

            <div className="product-row">
              <a
                href={product.main_image}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={product.main_image} alt={product.name} />
              </a>
              <div>
                <p className="product-name">{product.name}</p>
                <p className="product-type">Joining Package</p>
              </div>
            </div>

            <div className="price-row">
              <span>Price</span>
              <span>₹{product.price}</span>
            </div>

            <div className="price-row total">
              <span>Total Payable</span>
              <span>₹{product.price}</span>
            </div>

            <button className="checkout-btn" onClick={placeOrder}>
              Confirm & Place Order
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
