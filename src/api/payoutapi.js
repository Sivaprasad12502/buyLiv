import axiosClient from "./axiosClient";

export const fetchPayoutDetails=async () => {
    const res=await axiosClient.get("/wallet/my-requests/")
    return res.data
    
}

export const createPayoutDetails=async (bankDetails) => {
    const res=await axiosClient.post(`/wallet/payout/request/`,bankDetails)
    return res.data
}