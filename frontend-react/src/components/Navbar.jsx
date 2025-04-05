import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();


  return (
    <AppBar position="fixed" color="primary" elevation={4}>
      <Toolbar>
        {/* 左邊：網站標題 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          我的網站
        </Typography>

        {/* 右邊：導覽按鈕 */}
        <Box sx={{ display: 'flex', gap: 2 }}>

          <Button color="inherit" component={Link} to="/">首頁</Button>
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
