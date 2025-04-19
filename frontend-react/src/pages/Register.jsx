import { useState } from 'react';
import useAuth from '../context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { Button } from '@mui/material'; // ✅ 對的


const Register = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('success'); // ✅ 'success' or 'error'
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setAlertMsg('');
      const res = await axios.post('http://localhost:8000/api/register/', {
        userId,
        username,
        password
      });
      
      if(res.status === 200){
        setAlertType('success');               // ✅ 成功樣式
        setAlertMsg(res.data.message); 
        login(res.data.username);  // 將 username 存入 context
         // 1 秒後導頁（可選）
         setTimeout(() => navigate('/Login'), 1000);
         
      }

    } catch (err) {       
      setAlertType('error');                  // ❌ 錯誤樣式
      if (err.response?.status === 401 || err.response?.status === 404 || err.response?.status === 400) {
        setAlertMsg(err.response.data.message);
      } else {
        setAlertMsg('註冊失敗，請稍後再試');
      }
      //alert(err);
    }
  };

  const handledirectLogin = () => {
    // 導向註冊頁面
    console.log('回登入！');
    navigate('/Login');
  };
  return (
    <>
<AuthForm
    title="註冊"
    username={username}
    setUsername={setUsername}
    password={password}
    setPassword={setPassword}
    userId={userId}
    setUserId={setUserId}
    showUserID={true}
    handleLogin={handleRegister}
    alertMsg={alertMsg}
    alertType={alertType}
    buttonText="註冊"
/>
 <Button variant="contained" onClick={handledirectLogin}>
        回登入
      </Button>
  </>
  );
};

export default Register;
