import { useState } from 'react';
import useAuth from '../context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login= () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/login_view/', {
        username,
        password
      });
      login(res.data.username);  // 將 username 存入 context
      alert("Login Sucess")
      navigate('/');  // 回首頁
    } catch (err) {       
      alert(err);
    }
  };

  return (
    <>
    <div>
      <h2>登入</h2>
      <input placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="密碼" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>登入</button>
    </div>
    </>
  );
};

export default Login;
