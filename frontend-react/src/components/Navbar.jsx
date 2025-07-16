
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem} from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  return (
    <AppBar position="fixed" color="secondary" elevation={4}>
      <Toolbar>
        {/* 左邊：網站標題 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          我的網站
        </Typography>

        {/* 右邊：導覽按鈕 */}
        <Box sx={{ display: 'flex', gap: 2 }}>

          <Button color="inherit" component={Link} to="/">首頁</Button>
          {/* <Button color="inherit" component={Link} to="/FileUpload">檔案</Button> */}
          {/* ▼ 帶有下拉選單的「檔案」 */}
          <Button
            color="inherit"
            onClick={handleMenuOpen}
          >
            檔案 ▾
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/FileUpload" onClick={handleMenuClose}>上傳檔案</MenuItem>
            <MenuItem component={Link} to="/FileList" onClick={handleMenuClose}>檔案清單</MenuItem>
            <MenuItem component={Link} to="/SharedFiles" onClick={handleMenuClose}>共享檔案</MenuItem>

          </Menu>
          <Button color="inherit" component={Link} to="/Demo">辨識</Button>
          <Button color="inherit" component={Link} to="/App">Vite畫面</Button>
          <Button color="inherit" component={Link} to="/contact">聯絡方式</Button>
          {/* <Button color="inherit" component={Link} to="/Login">登入</Button> */}
        <span style={{ float: 'right' }}>
        {user ? (
          <>
            <Typography component="span">Hi, {user.username}</Typography>
            <Button color="inherit" onClick={logout}>登出</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/Login">登入</Button> 
        )}
      </span>

        </Box>
      </Toolbar>
    </AppBar>
  );
}
