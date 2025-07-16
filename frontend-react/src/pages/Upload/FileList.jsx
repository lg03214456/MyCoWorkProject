import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs, 
  Tab,
} from "@mui/material";
import { Visibility, Delete, Download, Share   } from "@mui/icons-material";
import axios from "axios";
import SnackbarComponent from '../../components/Snackbar.jsx';

const FileList = () => {
  const [fileList, setFileList] = useState([]);

  const [previewFile, setPreviewFile] = useState(null);
  const [previewText, setPreviewText] = useState(""); // 用於 txt 預覽內容

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetFileId, setTargetFileId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // 1. 新增 tabIndex 狀態
  const [tabIndex, setTabIndex] = useState(0);
  // 2. 根據 tabIndex 決定要抓哪一筆資料
  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openDeleteConfirm = (fileId) => {
    setTargetFileId(fileId);
    setConfirmOpen(true);
  };

  const getFileExtension = (filename) => filename?.split('.').pop().toLowerCase();

  const getFilenameFromHeader = (disposition) => {
    if (!disposition) return "downloaded_file";
    const filenameStarMatch = disposition.match(/filename\*=utf-8''(.+)/i);
    if (filenameStarMatch && filenameStarMatch[1]) return decodeURIComponent(filenameStarMatch[1]);
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
    if (filenameMatch && filenameMatch[1]) return decodeURIComponent(filenameMatch[1]);
    return "downloaded_file";
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const formData = new FormData();
    formData.append("user_id", user.Identified);
    const urls = [
    "http://localhost:8000/file/searchlist/",    // 上傳清單
    "http://localhost:8000/file/sharedlist/",    // 分享清單
    "http://localhost:8000/file/publiclist/",    // 公用清單
  ];
  console.log(tabIndex);
    axios
      .post(urls[tabIndex], formData)
      .then((res) => setFileList(res.data))
      .catch((err) => {
        console.error("檔案清單讀取失敗", err);
        setFileList([]);
      });
  }, [tabIndex]);


  console.log(fileList);
  // useEffect(() => {
  //   if (previewFile) {
  //     console.log("🟢 設定後 previewFile（useEffect）:", previewFile);
  //   }
  // }, [previewFile]);

  const handleDownload = (fileId) => {
    const formData = new FormData();
    formData.append("file_id", fileId);

    axios
      .post("http://localhost:8000/file/download/", formData, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data]);
        const disposition = response.headers["content-disposition"];
        const filename = getFilenameFromHeader(disposition);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch((err) => {
        console.error("下載失敗", err);
        showSnackbar("❌ 下載失敗", "error");
      });
  };

  const handlePreview = (fileId) => {
    const formData = new FormData();
    formData.append("file_id", fileId);
    axios
      .post("http://localhost:8000/file/Previewfile/", formData, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data]);       
        const contentType = response.headers['content-type'];
        const disposition = response.headers["content-disposition"];
        const filename = getFilenameFromHeader(disposition) || "預覽檔案";
        const extension = getFileExtension(filename);
        const url = URL.createObjectURL(new Blob([response.data], { type: contentType }));

        // console.log("✅ 準備設定 previewFile：", { id: fileId, url, filename, extension });

        if (extension === "txt") {
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewText(reader.result);
            setPreviewFile({ id: fileId, url, filename, extension });
          };
          reader.readAsText(blob);
        } else {
          setPreviewFile({ id: fileId, url, filename, extension });
        }
      })
      .catch((err) => {
        console.error("預覽失敗", err);
        showSnackbar("❌ 預覽失敗", "error");
      });
  };

  const handleDelete = () => {
    axios.delete("http://localhost:8000/file/deletefile/", {
      params: { file_id: targetFileId },
    })
      .then(() => {
        const deletedFile = fileList.find(file => file.id === targetFileId);
        const deletedFilename = deletedFile?.filename || '未知檔名';

        showSnackbar(`✅ 已刪除檔案：${deletedFilename}`, "success");
        setFileList(prev => prev.filter(file => file.id !== targetFileId));
      })
      .catch((err) => {
        console.error("刪除失敗", err);
        showSnackbar("❌ 刪除失敗", "error");
      })
      .finally(() => {
        setConfirmOpen(false);
        setTargetFileId(null);
      });
  };

  const handleShare = (file) => {
    showSnackbar(`🔗 分享連結產生（模擬）：${file.filename}`, "info");
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
    setPreviewText("");
  };

  return (
    
    <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
      {/* ✅ Tab 切換區 */}
    <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered sx={{ mb: 2 }}>
      <Tab label="上傳清單" />
      <Tab label="分享清單" />
      <Tab label="共用清單" />
    </Tabs>
  <Typography variant="subtitle1" sx={{ mb: 1 }}>
    目前{["上傳", "分享", "共用"][tabIndex]}檔案數量: {fileList.length}
  </Typography>

  <TableContainer sx={{ 
    border: '2px solid #666', 
    borderRadius: '8px',
    minHeight: 300, // ✅ 固定最小高度
    minWidth:600,
    mb: 2,           // 預留下方間距
      }}>
  <Table sx={{ border: '1px solid #ccc' }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ border: '1px solid #ccc' }}>編號</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' }}>檔案名稱</TableCell>
        <TableCell sx={{ border: '1px solid #ccc' }}>操作</TableCell>
      </TableRow>
    </TableHead>
        <TableBody>
          {fileList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">尚無檔案</TableCell>
            </TableRow>
          ) : (
            fileList.map((file, index) => (
              <TableRow key={file.id}>
                <TableCell sx={{ border: '1px solid #ccc' }}>{index + 1}</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>{file.filename}</TableCell>
                <TableCell sx={{ border: '1px solid #ccc' }}>
                  <IconButton onClick={() => handleDownload(file.id)}><Download /></IconButton>
                  <IconButton onClick={() => handlePreview(file.id)}><Visibility /></IconButton>
                  <IconButton onClick={() => openDeleteConfirm(file.id)}><Delete /></IconButton>
                  <IconButton onClick={() => handleShare(file)}><Share /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
  </Table>
</TableContainer>


      <Dialog open={!!previewFile} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>{previewFile?.filename || "預覽"}</DialogTitle>
        <DialogContent dividers>
          {previewFile?.url ? (
            previewFile.extension === "pdf" ? (
              <iframe src={previewFile.url} width="100%" height="600px" title="PDF Preview" />
            ) : ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(previewFile.extension) ? (
              <img src={previewFile.url} alt="Preview" style={{ width: "100%" }} />
            ) : previewFile.extension === "txt" ? (
              <Typography component="pre" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{previewText}</Typography>
            ) : (
              <Typography color="warning.main">⚠ 此檔案格式（.{previewFile.extension}）不支援預覽。</Typography>
            )
          ) : (
            <Typography color="error">⚠ 無法預覽檔案。</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>關閉</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>刪除確認</DialogTitle>
        <DialogContent>
          <p>確定要刪除這個檔案嗎？</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>確認刪除</Button>
        </DialogActions>
      </Dialog>

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default FileList;
