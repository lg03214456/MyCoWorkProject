import { useState } from 'react';
import useAuth from '../context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';



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
      const res = await axios.post('http://localhost:8000/api/login_view/', {
        username,
        password
      });
      
      if(res.status ===200){
        setAlertType('success');               // ✅ 成功樣式
        setAlertMsg(res.data.message); 
        login(res.data.username);  // 將 username 存入 context
         // 1 秒後導頁（可選）
         setTimeout(() => navigate('/'), 1000);
         
      }

    } catch (err) {       
      setAlertType('error');                  // ❌ 錯誤樣式
      if (err.response?.status === 401 || err.response?.status === 404) {
        setAlertMsg(err.response.data.message);
      } else {
        setAlertMsg('登入失敗，請稍後再試');
      }
      //alert(err);
    }
  };

  return (
    <>
    <div>
      <h2>登入</h2>

      {/* ✅ 顯示 Alert，根據 alertType 決定 success 或 error */}
      {alertMsg && (
        <Alert severity={alertType} sx={{ mb: 2 }}>
          {alertMsg}
        </Alert>
      )}

      <input placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="密碼" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>登入</button>
    </div>
    </>
  );
};

export default Login;
