import { useState } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import { Button, Box } from "@mui/material"; // ✅ 對的
import Windows8Loader from "../components/Windows8Loader/Windows8Loader";
//API config Switch
import { useConfig  } from "../context/useConfig"; // 或實際相對路徑
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // ✅ 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false); //Loading Status
  const navigate = useNavigate();

  const { baseUrl } = useConfig(); // ✅ 加上這行來取得 API base URL
  const handleLogin = async () => {
    try {       
      setIsLoading(true);
      setAlertMsg("");
      // const res = await axios.post("http://localhost:8000/api/login_view/", {
      //   username,
      //   password,
      // });
      // console.log(baseUrl)
      const res = await axios.post(`${baseUrl}api/login_view/`, {
        username,
        password,
      });

      if (res.status === 200) {
        setAlertType("success"); // ✅ 成功樣式
        setAlertMsg(res.data.message);
        // 登入成功，先記住使用者
        login(res.data.UserID, res.data.access, res.data.Identified); // 將 username 存入 context
        // ✅ 延遲導頁，動畫結束再轉頁

        setTimeout(() => {
          navigate("/");
          setIsLoading(false);
        }, 1000); // 可調整動畫顯示時間（ms）
      }
    } catch (err) {
      console.log("errTest");
      setAlertType("error"); // ❌ 錯誤樣式
      if (
        err.response?.status === 401 ||
        err.response?.status === 404 ||
        err.response?.status === 400
      ) {
        setAlertMsg(err.response.data.message);
        setIsLoading(false);
      } else {
        //setAlertMsg(err.response);
        setAlertMsg("登入失敗，請稍後再試");
        setIsLoading(false);
      }
      //alert(err);
    }
  };

  return (
    <>
      <AuthForm
        // title="登入畫面"
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        alertMsg={alertMsg}
        alertType={alertType}
        buttonText="登入"
        showHint={true}
      />
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Windows8Loader />
        </Box>
      )}
    </>
  );
};

export default Login;
