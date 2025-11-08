import { Routes, Route } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, MedicineBoxOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NurseWorkbench from '../pages/Nurse/NurseWorkbench';
import '../layouts/BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const NurseLayout = () => {
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
      key: 'workbench',
      icon: <DashboardOutlined />,
      label: '护士工作台',
      onClick: () => navigate('/nurse/workbench'),
    },
    {
      key: 'orders',
      icon: <MedicineBoxOutlined />,
      label: '医嘱执行',
      onClick: () => navigate('/nurse/orders'),
    },
  ];

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 护士端</div>
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
          <Menu mode="inline" defaultSelectedKeys={['workbench']} items={menuItems} />
        </Sider>
        <Content className="layout-content">
          <Routes>
            <Route path="workbench" element={<NurseWorkbench />} />
            <Route path="orders" element={<NurseWorkbench />} />
            <Route path="*" element={<NurseWorkbench />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NurseLayout;

