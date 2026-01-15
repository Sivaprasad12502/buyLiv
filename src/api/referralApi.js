import axiosClient from "./axiosClient";

export const fetchReferralLink = async () => {
  const res = await axiosClient.get("/accounts/referral-links/");
  return res.data;
};
