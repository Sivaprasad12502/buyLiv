import axiosClient from "./axiosClient";

// Buy joining package (Buy Now)
export const buyJoiningPackage = async (productId) => {
  const res = await axiosClient.post("/orders/orders/buynow/", {
    product_id: productId,
    quantity: 1,
  });
  return res.data;
};

// Get my orders
export const fetchMyOrders = async () => {
  const res = await axiosClient.get("/orders/orders/");
  return res.data;
};
