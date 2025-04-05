
import React, { useState } from 'react';
import { 
  Box,
  Button,
  Typography,
  Grid,
  Paper,

} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Demo() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultText, setResultText] = useState('尚未解析');
  const [loading, setLoading] = useState(false);

  // 上傳圖片時的處理
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultText('尚未解析'); // 每次換圖就重設解析結果
    }
  };

  // 按下解析圖片時的處理（暫時模擬）
  const handleParseImage = async() => {
    if (!selectedImage) {
      alert('請先上傳圖片');
      return;
    }
    setLoading(true);
    setResultText('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    //formData.append('uploaded_by', 'chy'); // 你可以從登入資訊帶入

    // TODO: 這裡可以改為真正呼叫後端的 OCR API
    //setResultText('模擬結果：這是解析後的文字...');
    try {
      const res = await axios.post('http://localhost:8000/api/parse_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 20000  ,// 最多等 20 秒
        withCredentials: false
      });
  
      if (res.status === 200) {
        setResultText(res.data.result || '無辨識內容');
      } else {
        setResultText(res.data.error || '解析失敗');
      }
    } catch (err) {
      console.error(err);
      setResultText(err.response?.data?.error || '後端連線錯誤' + (err.response?.data?.error || err.message));
    }finally {
     setLoading(false);
    }
  };



  return (
    
    <Box sx={{ p: 4 }}>
      {/* 上方按鈕區 */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" component="label">
          上傳圖片
          <input type="file" hidden onChange={handleFileChange} accept="image/*" />
        </Button>
        <Button variant="outlined" onClick={handleParseImage} disabled={loading}>
            {loading ? '解析中...' : '解析圖片'}
        </Button>
      </Box>

      {/* 下方並排 Panel 區 */}
      <Grid container spacing={2}>
        {/* 左側：圖片預覽 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              預覽圖片
            </Typography>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="上傳預覽"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 8 }}
              />
            ) : (
              <Typography color="text.secondary">尚未選擇圖片</Typography>
            )}
          </Paper>
        </Grid>

        {/* 右側：辨識結果 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, minHeight: 300 }}>
            <Typography variant="subtitle1" gutterBottom>
              解析結果
            </Typography>
            <Typography color="text.primary" whiteSpace="pre-line">
              {resultText}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
