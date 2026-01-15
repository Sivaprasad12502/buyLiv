import axiosClient from "./axiosClient";

export const fetchCart = async () => {
  const res = await axiosClient.get("/orders/cart/");
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await axiosClient.put(`/orders/cart/${itemId}/`, {
    quantity,
  });
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axiosClient.post("/orders/cart/add/", {
    product_id: productId,
    quantity,
  });
  return res.data;
};
