import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography, Space } from 'antd'; // 移除了 Button
import {
  UserOutlined,
  AuditOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  // 移除了 MenuUnfoldOutlined, MenuFoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegistrationReview from '../pages/Admin/RegistrationReview';
import PermissionManagement from '../pages/Admin/PermissionManagement';
import CustomerList from '../pages/Business/CustomerList'; // 导入 CustomerList 组件
// 移除了 useMediaQuery 和 { useState, useEffect }
import './AdminLayout.css';

const { Header, Content } = Layout; // 移除了 Sider
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  // 移除了 collapsed 状态和 isMobile 判断
  // 移除了 useEffect 钩子

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 根据当前路由获取选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/admin/customers')) return 'customers';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/registration-review')) return 'registration-review';
    return 'registration-review'; // 默认选中注册审核
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  const userMenuItems = [
    {
      key: 'user-profile',
      label: (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{user?.realName || user?.username}</Text>
        </Space>
      ),
      disabled: true, 
      className: 'user-profile-menu-item',
    },
    {
      type: 'divider', 
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuItems = [
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: '客户列表',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '权限配置',
    },
    {
      key: 'registration-review',
      icon: <AuditOutlined />,
      label: '注册审核',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === 'customers') navigate('/admin/customers');
    if (e.key === 'settings') navigate('/admin/settings');
    if (e.key === 'registration-review') navigate('/admin/registration-review');
  };

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 管理员</div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems.filter(Boolean)}
          className="header-menu"
          onClick={handleMenuClick}
          style={{ borderBottom: 'none' }}
        />
        <div className="header-avatar-area">
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <span> {/* 添加 span 标签包裹触发器 */}
              <a onClick={(e) => e.preventDefault()} className="ant-dropdown-link user-profile-trigger"> {/* 简单的 a 标签作为触发器，只包含 Avatar */}
                <Avatar icon={<UserOutlined />} />
              </a>
            </span>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        {/* 移除了 Sider 组件 */}
        <Content className="layout-content"> {/* 移除了 style={isMobile ? { marginLeft: 0 } : {}} */}
          <Routes>
            <Route path="registration-review" element={<RegistrationReview />} />
            <Route path="customers" element={<CustomerList />} /> {/* 替换为 CustomerList 组件 */}
            <Route path="settings" element={<PermissionManagement />} />
            <Route path="*" element={<RegistrationReview />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

