// src/api/axiosInstance.js
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'http://localhost:8000/api'; // 改成你的 Django API 網址

export const createAxiosInstance = (accessToken, updateAccessToken) => {
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // ✅ 關鍵：發 request 時帶上 cookie（如 refresh token）
  });

  axiosInstance.interceptors.request.use(async (config) => {
    if (!accessToken) return config;

    const decoded = jwt_decode(accessToken);
    const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 5000;

    if (!isExpired) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }

    // access token 已過期，發送 refresh request（會自動帶 cookie）
    try {
      const res = await axios.post(`${baseURL}/token/refresh/`, {}, {
        withCredentials: true
      });

      const newAccess = res.data.access;
      updateAccessToken(newAccess); // ✅ 更新 AuthContext 裡的 access token
      config.headers.Authorization = `Bearer ${newAccess}`;
    } catch (err) {
      console.error("🔒 無法刷新 access token", err);
    }

    return config;
  }, (err) => Promise.reject(err));

  return axiosInstance;
};
