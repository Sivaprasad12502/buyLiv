import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { fetchMyOrders } from "../api/orderApi";
import { MEDIA_BASE_URL } from "../utils/constants";
import {
  FiShoppingBag,
  FiPackage,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTruck,
  FiDollarSign,
  FiHash,
  FiImage,
} from "react-icons/fi";
import { BiBox, BiShoppingBag } from "react-icons/bi";
import Loading from "../components/Loader/Loading";
import "./Orders.scss";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);
  const order_status = [...new Set(orders?.map((order) => order.status))];
  const filteredOrders = filter
    ? orders.filter((order) => order.status === filter)
    : orders;

  if (loading) return <Loading />;

  return (
    <MainLayout>
      <div className="orders-page">
        <div className="orders-container">
          {/* Header Section */}
          <div className="orders-header">
            <div className="header-content">
              <BiShoppingBag className="header-icon" />
              <div className="header-info">
                <h1>My Orders</h1>
                <p>View and track all your orders in one place</p>
              </div>
            </div>
            <div className="orders-count">
              <FiPackage className="count-icon" />
              <span>
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>
          </div>
            <select className="select-box" name="" id="" onChange={(e) => setFilter(e.target.value)}>
              <option value="">ALL ORDERS</option>
              {order_status.map((status,index) => (
                <option value={status} key={index}>{status}</option>
              ))}
            </select>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="orders-empty">
              <BiBox className="empty-icon" />
              <h2>No Orders Yet</h2>
              <p>
                You haven't placed any orders yet. Start shopping to see your
                orders here!
              </p>
            </div>
          )}

          {/* Orders List */}
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id">
                      <FiHash className="info-icon" />
                      <span>Order {order.id}</span>
                    </div>
                    <div className="order-date">
                      <FiCalendar className="info-icon" />
                      <span>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <FiClock className="info-icon-small" />
                      <span>
                        {new Date(order.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                {/* Order Items */}
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image-wrapper">
                        {item.product.main_image ? (
                          <img
                            src={`${MEDIA_BASE_URL}${item.product.main_image}`}
                            alt={item.product.name}
                            className="item-image"
                          />
                        ) : (
                          <div className="item-image-placeholder">
                            <FiImage />
                          </div>
                        )}
                      </div>

                      <div className="item-details">
                        <h4 className="item-name">{item.product.name}</h4>
                        {item.product.long_description && (
                          <p className="item-description">
                            {item.product.long_description}
                          </p>
                        )}
                      </div>

                      <div className="item-quantity">
                        <FiPackage className="qty-icon" />
                        <span>Qty: {item.quantity}</span>
                      </div>

                      <div className="item-price">
                        {/* <span className="price-label">Subtotal</span> */}
                        <span className="price-value">
                          ₹{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="footer-total">
                    {/* <FiDollarSign className="total-icon" /> */}
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= COMPONENTS ================= */

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: {
      icon: FiClock,
      label: "Pending",
      className: "status-pending",
    },
    PROCESSING: {
      icon: FiAlertCircle,
      label: "Processing",
      className: "status-processing",
    },
    SHIPPED: {
      icon: FiTruck,
      label: "Shipped",
      className: "status-shipped",
    },
    DELIVERED: {
      icon: FiCheckCircle,
      label: "Delivered",
      className: "status-delivered",
    },
    CANCELLED: {
      icon: FiXCircle,
      label: "Cancelled",
      className: "status-cancelled",
    },
  };

  const config = statusConfig[status] || {
    icon: FiAlertCircle,
    label: status,
    className: "status-default",
  };

  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      <Icon className="status-icon" />
      <span>{config.label}</span>
    </span>
  );
}
