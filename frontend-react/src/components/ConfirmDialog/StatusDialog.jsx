// StatusDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import {
  CheckCircleOutline,
  ErrorOutline,
  WarningAmberOutlined,
  InfoOutlined,
} from "@mui/icons-material";

const iconMap = {
  success: <CheckCircleOutline color="success" sx={{ fontSize: 30, mr: 1 }} />,
  error: <ErrorOutline color="error" sx={{ fontSize: 30, mr: 1 }} />,
  warning: <WarningAmberOutlined color="warning" sx={{ fontSize: 30, mr: 1 }} />,
  info: <InfoOutlined color="info" sx={{ fontSize: 30, mr: 1 }} />,
};

const defaultTitleMap = {
  success: "操作成功",
  error: "發生錯誤",
  warning: "警告",
  info: "提示",
};

const StatusDialog = ({
  open,
  onClose,
  status = "success",
  title,
  message = "操作已完成",
  confirmText = "確定",
}) => {
  const icon = iconMap[status] || iconMap.info;
  const dialogTitle = title || defaultTitleMap[status];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center" >
          {icon}
          {dialogTitle}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color={status}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
