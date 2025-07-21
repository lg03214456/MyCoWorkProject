import React, { createContext, useState, useEffect } from 'react';

// 建立 Context
export const ConfigContext = createContext(null);

// 提供者元件
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/config.json');
        const json = await res.json();
        const env = json.ENV;
        const baseUrl = json[env]?.BASE_URL;

        if (!baseUrl) throw new Error(`config.json 中找不到 BASE_URL for ENV = ${env}`);

        setConfig({ env, baseUrl });
      } catch (err) {
        console.error('載入 config.json 失敗:', err);
        // 設定 fallback 或中斷
        setConfig({ env: 'development', baseUrl: 'http://localhost:8000/' });
      }
    };

    loadConfig();
  }, []);

  // 尚未載入完成時，顯示載入中畫面
  if (!config) {
    return <div>載入設定中...</div>;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
