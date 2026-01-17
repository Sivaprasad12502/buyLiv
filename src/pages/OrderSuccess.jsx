import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={container}>
        <div style={card}>
          {/* ICON */}
          <div style={icon}>✓</div>

          {/* TITLE */}
          <h2 style={title}>Order Placed Successfully</h2>

          {/* MESSAGE */}
          <p style={message}>
            Thank you for your purchase. Your order has been placed and is
            currently being processed.
          </p>

          <p style={subMessage}>
            You can track your order status anytime from your orders page.
          </p>

          {/* ACTIONS */}
          <div style={actions}>
            <button
              style={primaryBtn}
              onClick={() => navigate("/orders")}
            >
              View My Orders
            </button>

            <button
              style={secondaryBtn}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
};

const card = {
  maxWidth: "520px",
  width: "100%",
  padding: "40px 30px",
  border: "1px solid #e5e5e5",
  borderRadius: "14px",
  background: "#fff",
  textAlign: "center",
};

const icon = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#27ae60",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 auto 20px",
};

const title = {
  marginBottom: "12px",
};

const message = {
  fontSize: "16px",
  color: "#444",
  marginBottom: "6px",
};

const subMessage = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "28px",
};

const actions = {
  display: "flex",
  gap: "14px",
  justifyContent: "center",
};

const primaryBtn = {
  padding: "12px 20px",
  background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryBtn = {
  padding: "12px 20px",
  background: "#fff",
  color: "#38ef7d",
  border: "1px solid #38ef7d",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};
