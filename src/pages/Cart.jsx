import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { fetchCart, updateCartItem } from "../api/cartApi";
import axiosClient from "../api/axiosClient";
import { MEDIA_BASE_URL } from "../utils/constants";
import "./Cart.scss";
import { useAuth } from "../auth/AuthContext";
import { FaTrash } from "react-icons/fa";
import Loading from "../components/Loader/Loading";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {refreshCart}=useAuth()
  const loadCart = () => {
    return fetchCart().then(setCart);
  };

  useEffect(() => {
    loadCart().finally(() => setLoading(false));
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
  if(loading) return <Loading/>;

  return (
    <MainLayout>
      <div className="cart">
        <div className="cart__container">
          {/* <h2 className="cart__title">Shopping Cart</h2> */}

          {cartWithSubtotal.length === 0 && (
            <div className="cart__empty">
              {/* <div className="cart__empty-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2V3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H17V2C17 1.44772 16.5523 1 16 1C15.4477 1 15 1.44772 15 2V3H9V2Z" fill="currentColor" opacity="0.3"/>
                  <path d="M6 9C6 7.89543 6.89543 7 8 7H16C17.1046 7 18 7.89543 18 9V17C18 18.1046 17.1046 19 16 19H8C6.89543 19 6 18.1046 6 17V9Z" fill="currentColor"/>
                </svg>
              </div> */}
              <h2 className="cart__empty-title">Your Cart is Empty</h2>
              <p className="cart__empty-text">Looks like you haven't added anything to your cart yet.</p>
              <button 
                className="cart__empty-btn"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          )}

          {cartWithSubtotal.length > 0 && (
            <>
              <div className="cart__items">
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
                      {item.product.long_description && (
                        <p className="cart__desc">
                          {item.product.long_description}
                        </p>
                      )}
                      {/* <p className="cart__price">₹{Number(item.product.price).toFixed(2)}</p> */}

                      <button
                        className="cart__remove"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash/> Remove
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
              </div>

              <div className="cart__footer">
                <div className="cart__total">
                  <p>Total Amount</p>
                  <h3>₹{cartTotal.toFixed(2)}</h3>
                </div>

                <button
                  className="cart__checkout"
                  onClick={() => navigate("/checkout/normal")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
