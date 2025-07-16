import { createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 預設從 localStorage 載入（讓刷新後仍保留登入狀態）
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, accessToken, Identified) => {
    const newUser = { username, access: accessToken, Identified};
    setUser(newUser);
    // setUser({ username, accessToken });
    localStorage.setItem('user', JSON.stringify(newUser));
    // ❌ 不需要存 refresh token，因為已存在 Cookie 中
    //localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

