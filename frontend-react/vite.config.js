import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

//https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,               // 明確鎖住 port
    cors: true,                     // 開啟跨來源
    hmr: {
      host: '26.165.84.169',             // 設定正確 HMR 位址（你在 VPN 下的 IP）
    }
  }
})
