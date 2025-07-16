import { TextField, Button, Alert} from '@mui/material';


const AuthForm = ({ title, username, setUsername, password, setPassword, userID, setUserId, showUserID = false, handleLogin, alertMsg, alertType, buttonText}) => {
  return (
    <div>
      <h2>{title}</h2>

      {alertMsg && (
        <Alert severity={alertType} sx={{ mb: 2 }}>
          {alertMsg}
        </Alert>
      )}

    {showUserID && (
        <TextField
          fullWidth
          label="User ID"
          variant="outlined"
          margin="normal"
          value={userID}
          onChange={(e) => setUserId(e.target.value)}
        />
    )}
      <TextField
        fullWidth
        label="帳號"
        variant="outlined"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="密碼"
        type="password"
        variant="outlined"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin}>
        {buttonText}
      </Button>
      
    </div>
  );
};

export default AuthForm;
