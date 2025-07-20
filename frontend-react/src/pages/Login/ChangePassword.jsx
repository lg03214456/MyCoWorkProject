import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
} from "@mui/material";
import SnackbarComponent from "../../components/Snackbar.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import StatusDialog from "../../components/ConfirmDialog/StatusDialog.jsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../context/useAuth.jsx";

const ChangePassword = () => {
  //全域登入
  const { user, logout } = useAuth();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //Snacker Bar Status
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  //dialog 畫面開啟
  const [dialogOpen, setDialogOpen] = useState(false);

  //dialog msg
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    status: "success", // or error, warning, info
    title: "",
    message: "",
  });

  //navigate 宣告
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/Home"); // 🔁 導向 首頁
  };

  //Show Snacker Bar
  const showSnackbar = (msg, severity = "info", openstatus) => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(openstatus);
  };
  //確認對話框是否開啟
  const handleOpenDialog = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showSnackbar("請填寫所有欄位", "warning", true);
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar("兩次輸入的新密碼不一致", "error", true);
      return;
    }

    if (newPassword.length < 6) {
      showSnackbar("新密碼至少6個字元", "warning", true);
      return;
    }
    setDialogOpen(true); // ✅ 通過才打開對話框
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/changepassword/",
        {
          user,
          oldPassword,
          newPassword,
        }
      );

      if (res.status === 200) {
        setTimeout(
          () =>
            setStatusDialog({
              open: true,
              status: "success",
              title: "修改密碼成功",
              message: "修改密碼成功，請重新登入",
              action: "logoutAfterChange",
            }),
          1000
        );
      }

      if (res.status === 404) {
        // setAlertType('success');               // ✅ 成功樣式
        // setAlertMsg(res.data.message);
        // login(res.data.username);  // 將 username 存入 context
        //  // 1 秒後導頁（可選）
        //  setTimeout(() => navigate('/Login'), 1000);
        setStatusDialog({
          open: true,
          status: "error",
          title: "密碼錯誤",
          message: "原密碼不正確，請重新輸入",
        });

        // navigate("/Login");
      }
    } catch (err) {
      // ✅ 錯誤處理放這裡

      if (
        err.response?.status === 401 ||
        err.response?.status === 404 ||
        err.response?.status === 400
      ) {
        setStatusDialog({
          open: true,
          status: "error",
          title: "修改密碼失敗",
          message: err.response.data.message,
        });
      } else {
        setStatusDialog({
          open: true,
          status: "error",
          title: "修改密碼失敗",
          message: "Call api error",
        });
      }
    }

    showSnackbar("密碼變更成功", "success");
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ width: "80vh", p: 4 }}>
        <SnackbarComponent
          open={snackbarOpen}
          message={snackbarMsg}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          變更密碼
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          定期變更密碼以保護帳戶安全
        </Typography>

        <TextField
          fullWidth
          label="請輸入原本的密碼"
          type={showOldPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword((show) => !show)}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="新密碼至少6個半形英數字"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword((show) => !show)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="請再重新輸入一次新密碼"
          type={showNewPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword((show) => !show)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button fullWidth variant="outlined" onClick={handleBack}>
            返回
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#ffa726", "&:hover": { bgcolor: "#fb8c00" } }}
            onClick={handleOpenDialog}
          >
            確認變更
          </Button>
        </Stack>

        {/* 共用對話框 */}
        <ConfirmDialog
          open={dialogOpen}
          title="變更密碼"
          content="你確定要變更密碼嗎？"
          confirmText="確定變更"
          cancelText="返回"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        <StatusDialog
          open={statusDialog.open}
          onClose={() => {
            setStatusDialog({ ...statusDialog, open: false });

            if (statusDialog.action === "logoutAfterChange") {
              logout();             
            }
          }}
          status={statusDialog.status}
          title={statusDialog.title}
          message={statusDialog.message}
          confirmText="我知道了"
        />
      </Paper>
    </Box>
  );
};

export default ChangePassword;
