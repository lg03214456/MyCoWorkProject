import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Paper,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import axios from 'axios';

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [uploads, setUploads] = useState([]);


  const navigate = useNavigate();
  const handleListClick = () => {
      navigate('/FileList'); // 🔁 導向 /filelist 路由
    };

  // snackbar 狀態
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success' | 'error' | 'warning' | 'info'
  //drag
  const [dragging, setDragging] = useState(false);
  const handleDragOver = (e) => {
  e.preventDefault(); // 必須阻止預設行為才能 drop
};

const handleDragEnter = (e) => {
  e.preventDefault();
  setDragging(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  setDragging(false);
};

const handleDrop = (e) => {
  e.preventDefault();
  setDragging(false);

  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) {
    // 模擬 input 的選檔行為
    handleFileSelect({ target: { files } });
  }
}


  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 處理選檔
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + uploads.length > 10) {
      showSnackbar('❗ 最多只能上傳 10 個檔案', 'warning');
      return;
    }

    files.forEach((file) => {
      const maxSizeMB = 20;
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > maxSizeMB) {
        showSnackbar(`❌ 檔案「${file.name}」超過 ${maxSizeMB}MB，請重新選擇。`, 'error');
        return;
      }

      const reader = new FileReader();
      const id = Date.now() + Math.random();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploads((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, progress } : item
            )
          );
        }
      };

      reader.onloadend = () => {
        setUploads((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress: 100 } : item
          )
        );
      };

      reader.readAsArrayBuffer(file);

      setUploads((prev) => [
        ...prev,
        {
          id,
          name: file.name,
          progress: 0,
          file: file,
        },
      ]);
    });
  };

  // 移除檔案
  const handleRemove = (id) => {
    setUploads((prev) => prev.filter((item) => item.id !== id));
  };

  // 點擊上傳：將記憶體中的檔案傳至 Django
  const handleUploadClick = async () => {
    if (uploads.length === 0) {
      showSnackbar('⚠️ 請先選擇檔案再上傳。', 'warning');
      return;
    }

    const notReady = uploads.some((file) => file.progress < 100);
    if (notReady) {
      showSnackbar('有檔案尚未讀取完成，請稍後再上傳。', 'info');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user')); // 從 localStorage 取出使用者資訊
    if (!user || !user.Identified) {
      showSnackbar('⚠️ 找不到登入使用者，請重新登入。', 'error');
      return;
    }

    try {
      for (let fileItem of uploads) {
        const formData = new FormData();
        formData.append('file', fileItem.file); //檔案欄位 formData.append('file', file) 
        formData.append('user_id', user.Identified); // ✅ 傳遞使用者 ID(Identified) 普通欄位formData.append('key', val)
        const res = await axios.post('http://localhost:8000/file/upload/', formData);
        console.log(`檔案 ${fileItem.name} 回應：`, res.data);
      }
      showSnackbar('✅ 所有檔案已成功上傳！', 'success');
    } catch (err) {
      console.error(err);
      showSnackbar('❌ 上傳失敗，請稍後再試', 'error');
    }
  };

  const renderFileName = (file) => {
    return <Typography sx={{ width: '20%' }}>{file.name}</Typography>;
  };

  return (
    <Box sx={{ width: '100%', p: 4, paddingTop: '85px' }}>
      {/* 檔案選擇 */}
      <Paper
        elevation={3}
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}

        sx={{
          width: 300,
          height: 200,
          mx: 'auto',
          mb: 4,
          bgcolor: dragging ? '#ddd' : '#eee',
          border: dragging ? '2px dashed #666' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <CloudUpload sx={{ fontSize: 48 }} />
        <Typography variant="h6">File Upload</Typography>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>

      {/* 上傳進度列 */}
      <Paper elevation={2} sx={{ maxHeight: 300, overflowY: 'auto', p: 2, mb: 3 }}>
        {uploads.map((file) => (
          <Box key={file.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              {renderFileName(file)}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {file.progress < 100 ? '上傳中' : '✔ 完成'}
                </Typography>
                <IconButton size="small" onClick={() => handleRemove(file.id)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={file.progress} />
          </Box>
        ))}
      </Paper>

      {/* 上傳按鈕 */}
      
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleUploadClick}
                  sx={{ mx: 2, backgroundColor: '#1976d2', color: '#fff' }} // 藍底白字
          >
            上傳
          </Button>
          <Button variant="contained" onClick={handleListClick}
            sx={{ mx: 2, backgroundColor: '#1976d2', color: '#fff' }} // 藍底白字
          >
            
            檔案清單
          </Button>
        </Box>
      

      {/* Snackbar 訊息提示框 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
