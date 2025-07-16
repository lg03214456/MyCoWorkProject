import { useState } from 'react';
import useAuth from '../context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { Button } from '@mui/material'; // ✅ 對的



const Login= () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('success'); // ✅ 'success' or 'error'
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setAlertMsg('');
      console.log('Test')
      const res = await axios.post('http://localhost:8000/api/login_view/', {
        username,
        password
      });
      
      if(res.status === 200){
        setAlertType('success');               // ✅ 成功樣式
        setAlertMsg(res.data.message); 
        login(res.data.UserID, res.data.access, res.data.Identified);  // 將 username 存入 context
         // 1 秒後導頁（可選）
         setTimeout(() => navigate('/'), 1000);
         
      }

    } catch (err) { 
      console.log('errTest')      
      setAlertType('error');                  // ❌ 錯誤樣式
      if (err.response?.status === 401 || err.response?.status === 404 || err.response?.status === 400 ) {
        setAlertMsg(err.response.data.message);
      } else {
        //setAlertMsg(err.response);
        setAlertMsg('登入失敗，請稍後再試');
      }
      //alert(err);
    }
  };

  const handledirectRegister = () => {
    // 導向註冊頁面
    console.log('註冊！');
    navigate('/Register');
  };



  return (
    <>
  <AuthForm
    title="登入"
    username={username}
    setUsername={setUsername}
    password={password}
    setPassword={setPassword}
    handleLogin={handleLogin}
    alertMsg={alertMsg}
    alertType={alertType}
    buttonText="登入"
/>

  <Button variant="contained" onClick={handledirectRegister}>
  註冊頁面
</Button>
  </>
    // <>
    // <div>
    //   <h2>登入</h2>

    //   {/* ✅ 顯示 Alert，根據 alertType 決定 success 或 error */}
    //   {alertMsg && (
    //     <Alert severity={alertType} sx={{ mb: 2 }}>
    //       {alertMsg}
    //     </Alert>
    //   )}

    //   <TextField
    //   fullWidth
    //   label="帳號"
    //   variant="outlined"
    //   margin="normal"
    //   value={username}
    //   onChange={e => setUsername(e.target.value)}
    // />
    // <TextField
    //   fullWidth
    //   label="密碼"
    //   type="password"
    //   variant="outlined"
    //   margin="normal"
    //   value={password}
    //   onChange={e => setPassword(e.target.value)}
    // />

    // <Button variant="contained" onClick={handleLogin}>
    //   登入
    // </Button>
    // </div>
    // </>
  );
};

export default Login;
