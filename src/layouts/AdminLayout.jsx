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
import { useMediaQuery } from '../hooks/useMediaQuery';
import RegistrationReview from '../pages/Admin/RegistrationReview';
import PermissionManagement from '../pages/Admin/PermissionManagement';
import CustomerList from '../pages/Business/CustomerList'; // 导入 CustomerList 组件
import PersonalInfo from '../pages/Business/PersonalInfo';
// 移除了 { useState, useEffect }
import './AdminLayout.css';

const { Header, Content } = Layout; // 移除了 Sider
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile } = useMediaQuery();
  // 移除了 collapsed 状态
  // 移除了 useEffect 钩子

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 根据当前路由获取选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/admin/profile')) return []; // 个人信息页面不选中任何tab
    if (path.includes('/admin/customers')) return ['customers'];
    if (path.includes('/admin/settings')) return ['settings'];
    if (path.includes('/admin/registration-review')) return ['registration-review'];
    return ['registration-review']; // 默认选中注册审核
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/admin/profile'),
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

  // 获取用户名首字母
  const getUserInitial = () => {
    const name = user?.realName || user?.username || '';
    return name.charAt(0).toUpperCase();
  };

  // 生成头像背景色（白色，与蓝色背景搭配）
  const getAvatarColor = () => {
    return '#ffffff';
  };

  // 获取头像文字颜色
  const getAvatarTextColor = () => {
    return '#4A90E2';
  };

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 管理员</div>
        {!isMobile && (
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            items={menuItems.filter(Boolean)}
            className="header-menu"
            onClick={handleMenuClick}
            style={{ borderBottom: 'none' }}
          />
        )}
        <div className="header-right">
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="user-info-container">
              <Text className="username">{user?.realName || user?.username}</Text>
              <Avatar 
                style={{ 
                  backgroundColor: getAvatarColor(),
                  color: getAvatarTextColor(),
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {getUserInitial()}
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </Header>
      {isMobile && (
        <div className="mobile-menu-container">
          <Menu
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            items={menuItems.filter(Boolean)}
            className="mobile-menu"
            onClick={handleMenuClick}
          />
        </div>
      )}
      <Layout>
        {/* 移除了 Sider 组件 */}
        <Content className="layout-content"> {/* 移除了 style={isMobile ? { marginLeft: 0 } : {}} */}
          <Routes>
            <Route path="registration-review" element={<RegistrationReview />} />
            <Route path="customers" element={<CustomerList />} /> {/* 替换为 CustomerList 组件 */}
            <Route path="settings" element={<PermissionManagement />} />
            <Route path="profile" element={<PersonalInfo />} />
            <Route path="*" element={<RegistrationReview />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

