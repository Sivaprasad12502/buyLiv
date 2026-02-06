import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchProfile } from "../api/profileApi";
import { buyJoiningPackage } from "../api/orderApi";
import "./CheckoutJoining.scss";
import { FaMapMarkerAlt, FaUser, FaCity } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../components/Loader/Loading";

export default function CheckoutJoining() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;


  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  const placeOrder = async () => {
    try {
      await buyJoiningPackage(product.id, 1);
      toast.success("Order placed. Waiting for admin approval.");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to place order. Please try again."
      );

    }
  };

  if (!profile) return <Loading/>;

  return (
    <MainLayout>
      <div className="checkout-wrapper">
        {/* <h2 className="checkout-title"></h2> */}

        <div className="checkout-grid">
          {/* LEFT: Address */}
         
            <div className="checkout-card">
              <h3>
                <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                Delivery Address
              </h3>

              <div className="address-box">
                <p className="name">
                  <FaUser style={{ marginRight: "6px" }} />
                  {profile.profile.full_name || " N/A"}
                </p>

                <p>
                  <FaMapMarkerAlt style={{ marginRight: "6px" }} />
                  {profile.profile.address || " N/A"}
                </p>

                <p>
                  <FaCity style={{ marginRight: "6px" }} />
                  {profile.profile.city || " N/A"}, {profile.profile.state || " N/A"}
                </p>
              </div>
            </div>
          

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
