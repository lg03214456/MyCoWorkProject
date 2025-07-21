import { useContext } from 'react';
import { ConfigContext } from './ConfigContext';

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig 必須用在 ConfigProvider 內');
  return context;
};