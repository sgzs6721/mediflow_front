import { Routes, Route } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import {
  UserOutlined,
  AuditOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegistrationReview from '../pages/Admin/RegistrationReview';
import PermissionManagement from '../pages/Admin/PermissionManagement';
import '../layouts/BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'registration-review',
      icon: <AuditOutlined />,
      label: '注册审核',
      onClick: () => navigate('/admin/registration-review'),
    },
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: '客户公海',
      onClick: () => navigate('/admin/customers'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '权限配置',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 管理员</div>
        <div className="header-right">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <Text className="username">{user?.realName || user?.username}</Text>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="layout-sider">
          <Menu mode="inline" defaultSelectedKeys={['registration-review']} items={menuItems} />
        </Sider>
        <Content className="layout-content">
          <Routes>
            <Route path="registration-review" element={<RegistrationReview />} />
            <Route path="customers" element={<div>客户公海（开发中）</div>} />
            <Route path="settings" element={<PermissionManagement />} />
            <Route path="*" element={<RegistrationReview />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

