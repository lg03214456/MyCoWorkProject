import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  // 檔案選單的狀態
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const handleFileMenuOpen = (event) => setFileMenuAnchorEl(event.currentTarget);
  const handleFileMenuClose = () => setFileMenuAnchorEl(null);

  // 使用者選單的狀態
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  return (
    <AppBar position="fixed" elevation={4}
        sx={{ backgroundColor: '#7d5fb2' ,

    backgroundImage: 'none', // 確保沒有漸層
    backdropFilter: 'none',  // 防止模糊背景
    opacity: 1,              // 強制完全不透明
        }} // 淺紫色（紫藤色）
    >
      <Toolbar>
        {/* 左邊：網站標題 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          我的網站
        </Typography>

        {/* 右邊：導覽按鈕 */}
        <Box sx={{ display: 'flex', gap: 2 }}>

          <Button color="inherit" component={Link} to="/">首頁</Button>

          {/* ▼ 檔案下拉選單 */}
          <Button color="inherit" onClick={handleFileMenuOpen}>
            檔案 ▾
          </Button>
          <Menu
            anchorEl={fileMenuAnchorEl}
            open={Boolean(fileMenuAnchorEl)}
            onClose={handleFileMenuClose}
          >
            <MenuItem component={Link} to="/FileUpload" onClick={handleFileMenuClose}>上傳檔案</MenuItem>
            <MenuItem component={Link} to="/FileList" onClick={handleFileMenuClose}>檔案清單</MenuItem>
            <MenuItem component={Link} to="/SharedFiles" onClick={handleFileMenuClose}>共享檔案</MenuItem>
          </Menu>

          <Button color="inherit" component={Link} to="/Demo">辨識</Button>
          <Button color="inherit" component={Link} to="/App">Vite畫面</Button>
          <Button color="inherit" component={Link} to="/contact">聯絡方式</Button>

          {/* ▼ 使用者登入/登出下拉選單 */}
          {user ? (
            <>
              <Button color="inherit" onClick={handleUserMenuOpen}>
                Hi, {user.username}
              </Button>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/ChangePassword"
                  onClick={handleUserMenuClose}
                >
                  修改密碼
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleUserMenuClose();
                    logout();
                  }}
                >
                  登出
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/Login">
              登入
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
