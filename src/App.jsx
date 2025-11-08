import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BusinessLayout from './layouts/BusinessLayout';
import DoctorLayout from './layouts/DoctorLayout';
import NurseLayout from './layouts/NurseLayout';
import AdminLayout from './layouts/AdminLayout';
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 商务端路由 */}
            <Route
              path="/business/*"
              element={
                <PrivateRoute allowedRoles={['BUSINESS', 'BUSINESS_ADMIN']}>
                  <BusinessLayout />
                </PrivateRoute>
              }
            />

            {/* 医生端路由 */}
            <Route
              path="/doctor/*"
              element={
                <PrivateRoute allowedRoles={['DOCTOR']}>
                  <DoctorLayout />
                </PrivateRoute>
              }
            />

            {/* 护士端路由 */}
            <Route
              path="/nurse/*"
              element={
                <PrivateRoute allowedRoles={['NURSE']}>
                  <NurseLayout />
                </PrivateRoute>
              }
            />

            {/* 管理员路由 */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={['BUSINESS_ADMIN']}>
                  <AdminLayout />
                </PrivateRoute>
              }
            />

            {/* 默认路由 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

