import axiosClient from "./axiosClient";

export const fetchProfile = async () => {
  const res = await axiosClient.get("/accounts/profile/");
  return res.data;
};


export const updateProfile = async (data) => {
  const res = await axiosClient.patch("/accounts/profile/", data);
  return res.data;
};
export const changePassword=async (password) => {
  const res=await axiosClient.post("/accounts/change-password/",password)
  return res.data
  
}
