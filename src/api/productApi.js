import axiosClient from "./axiosClient";

// Categories (public)
export const fetchCategories = async () => {
  const res = await axiosClient.get("/products/category/");
  return res.data;
};

// Normal products ONLY (public)
export const fetchNormalProducts = async () => {
  const res = await axiosClient.get(
    "/products/public/?product_type=normal"
  );
  return res.data;
};

// Joining products ONLY (public, but gated by UI)
export const fetchJoiningProducts = async () => {
  const res = await axiosClient.get(
    "/products/public/?product_type=joining"
  );
  return res.data;
};

// Product detail (public, normal products)
export const fetchProductById = async (id) => {
  const res = await axiosClient.get(`/products/public/${id}/`);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await axiosClient.get(
    `/products/public/?search=${encodeURIComponent(query)}`
  );
  return res.data;
};