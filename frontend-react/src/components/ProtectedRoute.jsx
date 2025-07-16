// // src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import useAuth from '../context/useAuth';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();

//   // ❗尚未登入者，直接導向 /Login
//   if (!user || !user.access) {
//     return <Navigate to="/Login" replace />;
//   }

//   // ✅ 登入成功者，顯示原本的子元件
//   return children;
// };

// export default ProtectedRoute;
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!user || !user.access) {
      // 顯示提示訊息
      setShowWarning(true);
      // 2 秒後跳轉
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 5000);
      return () => clearTimeout(timer); // 清除定時器
    }
  }, [user]);

  // ⚠️ 顯示提示
  if (showWarning && !shouldRedirect) {
    return (
      
<div className="flex justify-center items-center h-screen bg-white overflow-hidden">
  <div className="flex flex-col items-center gap-6">
    
    {/* ✅ 上方動畫：由左至右循環跑動 */}
    <div className="w-screen overflow-hidden h-32 relative">
      <img
        src="/picture/animate.gif"
        alt="dog running"
        className="absolute top-0 left-0 w-28 animate-moveRightLoop"
      />
    </div>

{/* ✅ 上方動畫：由左至右循環跑動 */}
    <div className="w-screen overflow-hidden h-32 relative">
      <img
        src="/picture/loading.gif"
        alt="dog running"
        className="absolute top-0 left-0 w-56 animate-moveRightLoop"
      />
    </div>
    {/* ✅ 下方登入提示文字方框 */}
    <div className="bg-white p-6 rounded shadow text-center">
      <p className="text-lg font-semibold text-red-600">
        您尚未登入，將為您導向登入頁面…
      </p>
    </div>
  </div>
</div>

    );
  }

  // 🔁 執行跳轉
  if (shouldRedirect) {
    return <Navigate to="/Login" replace />;
  }

  // ✅ 顯示原本頁面
  return children;
};

export default ProtectedRoute;
