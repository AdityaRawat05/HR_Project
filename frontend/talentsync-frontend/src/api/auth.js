import api from "../utils/axios";

export const loginUser = (data) => api.post("/accounts/login/", data);

export const registerUser = (data) =>
  api.post("/accounts/register/", data);

export const getProfile = () =>
  api.get("/accounts/profile/");
