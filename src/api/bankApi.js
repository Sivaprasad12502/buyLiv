import axiosClient from "./axiosClient";

export const fetchBankDetails=async () => {
    const res=await axiosClient.get("/accounts/bank-account/")
    return res.data
    
}
export const updateBankDetails=async (bankDetails) => {
    const res=await axiosClient.patch(`/accounts/bank-account/`,bankDetails)
    return res.data
    
}
export const createBankDetails=async (bankDetails) => {
    const res=await axiosClient.post(`/accounts/bank-account/`,bankDetails)
    return res.data
}