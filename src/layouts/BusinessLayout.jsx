import { Routes, Route } from 'react-router-dom';
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
import CustomerList from '../pages/Business/CustomerList';
import CustomerDetail from '../pages/Business/CustomerDetail';
import './BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const BusinessLayout = () => {
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
      key: 'customers',
      icon: <TeamOutlined />,
      label: '客户管理',
      onClick: () => navigate('/business/customers'),
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: '订单管理',
      onClick: () => navigate('/business/orders'),
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: '预约管理',
      onClick: () => navigate('/business/appointments'),
    },
  ];

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 商务端</div>
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
          <Menu
            mode="inline"
            defaultSelectedKeys={['customers']}
            items={menuItems}
          />
        </Sider>
        <Content className="layout-content">
          <Routes>
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="orders" element={<div>订单管理页面（开发中）</div>} />
            <Route path="appointments" element={<div>预约管理页面（开发中）</div>} />
            <Route path="*" element={<CustomerList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BusinessLayout;

