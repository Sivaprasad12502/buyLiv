import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchMyOrders } from "../api/orderApi";
import { MEDIA_BASE_URL } from "../utils/constants";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders().then(setOrders);
  }, []);
  if(orders){
    console.log("orders from my ordersss",orders)
  }

  return (
    <MainLayout>
      <div style={container}>
        <h2 style={{ marginBottom: "24px" }}>My Orders</h2>

        {orders.length === 0 && (
          <p style={{ color: "#666" }}>
            You have not placed any orders yet.
          </p>
        )}

        {orders.map((order) => (
          <div key={order.id} style={orderCard}>
            {/* ===== HEADER ===== */}
            <div style={orderHeader}>
              <div>
                <strong>Order #{order.id}</strong>
                <p style={dateText}>
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <StatusBadge status={order.status} />
            </div>

            {/* ===== ITEMS ===== */}
            <div>
              {order.items.map((item) => (
                <div key={item.id} style={itemRow}>
                  {item.product.image && (
                    <img
                      src={`${MEDIA_BASE_URL}${item.product.image}`}
                      alt={item.product.name}
                      style={itemImage}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <strong>{item.product.name}</strong>
                    {item.product.short_description && (
                      <p style={desc}>
                        {item.product.short_description}
                      </p>
                    )}
                  </div>

                  <div style={qty}>Qty: {item.quantity}</div>

                  <div style={price}>
                    ₹{item.subtotal}
                  </div>
                </div>
              ))}
            </div>

            {/* ===== FOOTER ===== */}
            <div style={orderFooter}>
              <span>Total Amount</span>
              <strong>₹{order.total_amount}</strong>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

/* ================= COMPONENTS ================= */

function StatusBadge({ status }) {
  const colors = {
    PENDING: "#f39c12",
    DELIVERED: "#27ae60",
    CANCELLED: "#c0392b",
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
        background: colors[status] || "#bdc3c7",
        color: "#fff",
      }}
    >
      {status}
    </span>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const orderCard = {
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  background: "#fff",
};

const orderHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const dateText = {
  fontSize: "14px",
  color: "#666",
};

const itemRow = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "12px 0",
  borderTop: "1px solid #eee",
};

const itemImage = {
  width: "70px",
  height: "70px",
  objectFit: "cover",
  borderRadius: "6px",
};

const desc = {
  fontSize: "14px",
  color: "#555",
};

const qty = {
  minWidth: "80px",
  textAlign: "center",
};

const price = {
  minWidth: "100px",
  textAlign: "right",
  fontWeight: "600",
};

const orderFooter = {
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "16px",
};
