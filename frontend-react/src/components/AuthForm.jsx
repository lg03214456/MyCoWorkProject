import {
  TextField,
  Button,
  Alert,
  Box,
  Paper,
  Stack,
  Typography,
  Link,
} from "@mui/material";

const AuthForm = ({
  username,
  setUsername,
  password,
  setPassword,
  userID,
  setUserId,
  showUserID = false,
  handleLogin,
  alertMsg,
  alertType,
  buttonText,
  showHint,
  handledirectLogin,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ 防止預設跳頁
    handleLogin(e); // ✅ 呼叫原本的登入邏輯
  };
  const inputFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#1f2235",
  },
  "& .MuiInputLabel-root": {
    color: "#aaa",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#333",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1675f2",
  },
};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      flexDirection="column"
      elevation={6}
      sx={{
        p: 4,
        backgroundColor: "#0f111c", //#273377
        width: "75vw",
        height: "100vh",
        paddingTop: {
          xs: 2,
          sm: 4,
          md: 8,
        },
        borderRadius: 5,
        px: 2,

        // ✅ 關鍵：雙層陰影效果
        boxShadow: `
    0 0 0 2px rgba(255, 255, 255, 0.3),  /* 外框描邊 */
    0 6px 20px rgba(0, 0, 0, 0.3)        /* 下層陰影 */
  `,
      }}
    >
      {/* Logo 圖片 */}
      <Box mb={2}>
        <img src="/logo.png" alt="Logo" style={{ width: 400 }} />
      </Box>
      {/* <Typography variant="h4" fontWeight="bold" color="white" mb={2}>
        NovaCore
      </Typography> */}
      <Paper
        elevation={0}
        sx={{
          width: {
            xs: "90%",
            sm: 400,
          },
          borderRadius: 3,
          backgroundColor: "#161a2b", // ✅ 深灰卡片底
          p: 4,
        }}
      >
        {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography> */}
        {alertMsg && (
          <Alert severity={alertType} sx={{ mb: 2 }}>
            {alertMsg}
          </Alert>
        )}

        {/* ✅ 表單開始：支援 Enter */}
        <form onSubmit={handleSubmit}>
          {showUserID && (
            <TextField
              fullWidth
              label="User ID"
              variant="outlined"
              margin="normal"
              value={userID}
              onChange={(e) => setUserId(e.target.value)}
              sx={inputFieldStyle}
            />
          )}
          <TextField
            fullWidth
            label="帳號"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={inputFieldStyle}
          />
          <TextField
            fullWidth
            label="密碼"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputFieldStyle}
          />
          {showHint && (
            <Box sx={{ width: "100%" }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  mt: 1,
                  color: "#888",
                  textAlign: "right",
                  float: "right",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </Link>
            </Box>
          )}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3 }}
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={handleLogin}
              type="submit" //支援Enter鍵
              sx={{
                backgroundColor: "#1675f2", // ✅ 藍色主按鈕
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#125cd2",
                },
              }}
            >
              {buttonText}
            </Button>
            {!showHint && (
              <Button
                variant="contained"
                onClick={handledirectLogin}
                sx={{
                  backgroundColor: "#1675f2", // ✅ 藍色主按鈕
                  borderRadius: "12px",
                }}
              >
                回登入
              </Button>
            )}
          </Stack>
        </form>
        {/* Sign up */}
        {showHint && (
          <Typography variant="body2" sx={{ mt: 3, color: "#aaa" }}>
            Don't have an account?{" "}
            <Link href="/Register" underline="hover">
              Sign up
            </Link>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AuthForm;
