import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Demo from './pages/Demo_page.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout';       // 包含 Navbar 的 Layout
import { AuthProvider } from './context/AuthContext'; // ✅ 根據實際路徑

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <AuthProvider> {/* ✅ 這裡包起來 */}
    <BrowserRouter>
      <Routes>
        {/* 預設進來就導向 /home */}
        <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/App" element={<App />} />
        <Route path="/Demo" element={<Demo />} />
      </Route>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>

)

 