import { Routes, Route } from 'react-router-dom';
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
import '../layouts/BusinessLayout.css';

const { Header, Content } = Layout; // 移除了 Sider
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // 移除了 collapsed 状态和 isMobile 判断
  // 移除了 useEffect 钩子

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 移除了 toggleCollapsed 函数

  const userMenuItems = [
    {
      key: 'user-profile',
      label: (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{user?.realName || user?.username}</Text>
        </Space>
      ),
      disabled: true, // 用户信息不可点击
      className: 'user-profile-menu-item', // 添加 class 用于样式调整
    },
    {
      type: 'divider', // 分割线
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: '客户列表', // 将 '客户公海' 更名为 '客户列表'
      onClick: () => navigate('/admin/customers'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '权限配置',
      onClick: () => navigate('/admin/settings'),
    },
    {
      key: 'registration-review',
      icon: <AuditOutlined />,
      label: '注册审核',
      onClick: () => navigate('/admin/registration-review'),
    },
  ];

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 管理员</div>
        {/* 移除了移动端菜单切换按钮 */}
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['customers']} // 调整默认选中项为 'customers'
          items={menuItems}
          className="header-menu" // 新增class用于样式调整
        />
        {/* 将用户头像和下拉菜单移动到右上角 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <span> {/* 添加 span 标签包裹触发器 */}
            <a onClick={(e) => e.preventDefault()} className="ant-dropdown-link user-profile-trigger"> {/* 简单的 a 标签作为触发器，只包含 Avatar */}
              <Avatar icon={<UserOutlined />} />
            </a>
          </span>
        </Dropdown>
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

