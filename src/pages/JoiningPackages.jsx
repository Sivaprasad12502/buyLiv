import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchJoiningProducts } from "../api/productApi";
import { fetchMyOrders } from "../api/orderApi";
import { getJoiningOrderStatus } from "../utils/joiningOrder";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import "./JoiningPackeges.scss";

export default function JoiningPackages() {
  const [packages, setPackages] = useState([]);
  const [joiningStatus, setJoiningStatus] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { redirectTo: "/joining-packages" },
      });
      return;
    }

    fetchJoiningProducts().then((products) => {
      setPackages(products.filter((p) => p.is_joining));
    });

    fetchMyOrders().then((orders) => {
      setJoiningStatus(getJoiningOrderStatus(orders));
    });
  }, [token, navigate]);

  const handleBuyNow = (product) => {
    if (joiningStatus === "PENDING") {
      alert("Your joining package is under admin review.");
      return;
    }

    if (joiningStatus === "DELIVERED") {
      alert("Your account is already activated.");
      return;
    }

    navigate("/checkout/joining", {
      state: { product },
    });
  };

  return (
    <MainLayout>
      <div className="joining-container">
        <h2 className="joining-title">Joining Packages</h2>
        <p className="joining-subtitle">
          Purchase a joining package to activate your account.
        </p>

        {joiningStatus === "PENDING" && (
          <p className="status pending">
            ⏳ Your joining package is pending admin approval.
          </p>
        )}

        {joiningStatus === "DELIVERED" && (
          <p className="status success">
            ✅ Your account is activated.
          </p>
        )}

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <ImageSlider images={pkg.images} name={pkg.name} />

              <div className="package-info">
                <h3>{pkg.name}</h3>
                <p className="price">₹{pkg.price}</p>
                <p className="desc">{pkg.short_description}</p>
              </div>

              {joiningStatus === null && (
                <button
                  className="buy-btn"
                  onClick={() => handleBuyNow(pkg)}
                >
                  Buy Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
