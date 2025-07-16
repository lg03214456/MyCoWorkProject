// src/hooks/useAxios.js
import useAuth from '../context/useAuth';
import { createAxiosInstance } from '../api/axiosInstance';

const useAxios = () => {
  const { user, updateAccessToken } = useAuth();
  const accessToken = user?.access || null;

  return createAxiosInstance(accessToken, updateAccessToken);
};

export default useAxios;
