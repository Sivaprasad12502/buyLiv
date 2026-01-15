import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchCart, updateCartItem } from "../api/cartApi";
import axiosClient from "../api/axiosClient";
import { MEDIA_BASE_URL } from "../utils/constants";
import "./Cart.scss";
import { useAuth } from "../auth/AuthContext";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const {refreshCart}=useAuth()
  const loadCart = () => {
    fetchCart().then(setCart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = async (itemId, qty) => {
    if (qty < 1) {
      await removeItem(itemId);
      return;
    }
    await updateCartItem(itemId, qty);
    loadCart();
    refreshCart()
  };

  const removeItem = async (itemId) => {
    try {
      await axiosClient.delete(`/orders/cart/${itemId}/`);
    } catch {
      await updateCartItem(itemId, 0);
    }
    loadCart();
    refreshCart()
  };

  const cartWithSubtotal = cart.map((item) => ({
    ...item,
    subtotal: Number(item.product.price) * Number(item.quantity),
  }));

  const cartTotal = cartWithSubtotal.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return (
    <MainLayout>
      <div className="cart">
        <h2 className="cart__title">Your Cart</h2>

        {cartWithSubtotal.length === 0 && (
          <p className="cart__empty">Your cart is empty.</p>
        )}

        {cartWithSubtotal.map((item) => (
          <div key={item.id} className="cart__row">
            {/* IMAGE */}
            {item.product.images?.length > 0 && (
              <img
                className="cart__image"
                src={`${MEDIA_BASE_URL}${item.product.images[0].image}`}
                alt={item.product.name}
              />
            )}

            {/* DETAILS */}
            <div className="cart__details">
              <h4>{item.product.name}</h4>
              {item.product.short_description && (
                <p className="cart__desc">
                  {item.product.short_description}
                </p>
              )}
              <p className="cart__price">₹{item.product.price}</p>

              <button
                className="cart__remove"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>

            {/* QTY */}
            <div className="cart__qty">
              <button onClick={() => changeQty(item.id, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQty(item.id, item.quantity + 1)}>
                +
              </button>
            </div>

            {/* SUBTOTAL */}
            <div className="cart__subtotal">
              ₹{item.subtotal.toFixed(2)}
            </div>
          </div>
        ))}

        {cartWithSubtotal.length > 0 && (
          <div className="cart__footer">
            <div>
              <p>Total Amount</p>
              <h3>₹{cartTotal.toFixed(2)}</h3>
            </div>

            <button
              className="cart__checkout"
              onClick={() => navigate("/checkout/normal")}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
