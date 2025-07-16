import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Demo from './pages/Demo_page.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import FileUpload from './pages/Upload/FileUpload.jsx'
import FileList from './pages/Upload/FileList.jsx'
import Layout from './components/Layout';       // 包含 Navbar 的 Layout
import { AuthProvider } from './context/AuthContext'; // ✅ 根據實際路徑
import ProtectedRoute from './components/ProtectedRoute';


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <AuthProvider> {/* ✅ 提供全域登入狀態 */}
    <BrowserRouter>
      <Routes>
        {/* ✅ 公開頁面 */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />


        {/* 預設進來就導向 /home */}
        <Route element={
          <ProtectedRoute>
          <Layout /> {/* Navbar + Outlet */}
          </ProtectedRoute>
          }>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/FileList" element={<FileList />} />
        <Route path="/App" element={<App />} />
        <Route path="/Demo" element={<Demo />} />
      </Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>

)

 