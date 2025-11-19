import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import CustomerList from '../pages/Business/CustomerList';
import CustomerDetail from '../pages/Business/CustomerDetail';
import AppointmentManagement from '../pages/Business/AppointmentManagement';
import PersonalInfo from '../pages/Business/PersonalInfo';
import './BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const BusinessLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile } = useMediaQuery();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/business/profile'),
    },
    {
      type: 'divider',
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
      label: '客户管理',
      onClick: () => navigate('/business/customers'),
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: '预约管理',
      onClick: () => navigate('/business/appointments'),
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/profile')) return []; // 个人信息页面不选中任何tab
    if (path.includes('/customers')) return ['customers'];
    if (path.includes('/appointments')) return ['appointments'];
    return ['customers'];
  };

  // 获取用户名首字母
  const getUserInitial = () => {
    const name = user?.realName || user?.username || '';
    return name.charAt(0).toUpperCase();
  };

  // 生成头像背景色（基于用户名）
  const getAvatarColor = () => {
    const name = user?.realName || user?.username || '';
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 商务端</div>
        <div className="header-right">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="user-info-container">
              <Text className="username">{user?.realName || user?.username}</Text>
              <Avatar 
                style={{ 
                  backgroundColor: getAvatarColor(),
                  cursor: 'pointer'
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
            items={menuItems}
            className="mobile-menu"
          />
        </div>
      )}
      <Layout>
        {!isMobile && (
          <Sider width={200} className="layout-sider">
            <Menu
              mode="inline"
              selectedKeys={getSelectedKey()}
              items={menuItems}
            />
          </Sider>
        )}
        <Content className="layout-content">
          <Routes>
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="orders" element={<div>订单管理页面（开发中）</div>} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="profile" element={<PersonalInfo />} />
            <Route path="*" element={<CustomerList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BusinessLayout;

