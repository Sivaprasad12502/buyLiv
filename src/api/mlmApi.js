import axiosClient from "./axiosClient";

export const fetchEarningsSummary = async (date) => {
  const res = await axiosClient.get(`/mlm/earnings/summary/?date=${date}`);
  return res.data;
};

export const fetchDirectReferrals = async () => {
  const res = await axiosClient.get("/accounts/direct-referrals/");
  return res.data;
};

export const fetchDownlines = async () => {
  const res = await axiosClient.get("/accounts/downlines/");
  return res.data;
};

export const fetchWallets = async () => {
  const res = await axiosClient.get("/wallet/wallets/");
  return res.data;
};

export const fetchPendingRequests = () =>
  axiosClient.get("/mlm/requests/pending/").then((res) => res.data);

export const fetchAvailableParents = () =>
  axiosClient.get("/mlm/tree/available-parents/").then((res) => res.data);

export const approveRequest = (requestId, payload) =>
  axiosClient.post(`/mlm/requests/${requestId}/approve/`, payload);

export const rejectRequest = async (id) => {
  return axiosClient.post(`/mlm/requests/${id}/reject/`);
};
