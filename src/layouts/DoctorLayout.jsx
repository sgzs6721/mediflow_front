import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import DoctorWorkbench from '../pages/Doctor/DoctorWorkbench';
import '../layouts/BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DoctorLayout = () => {
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
      label: '医生工作台',
      onClick: () => navigate('/doctor/workbench'),
    },
    {
      key: 'patients',
      icon: <FileTextOutlined />,
      label: '我的患者',
      onClick: () => navigate('/doctor/patients'),
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/workbench')) return ['workbench'];
    if (path.includes('/patients')) return ['patients'];
    return ['workbench'];
  };

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 医生端</div>
        <div className="header-right">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <Text className="username">{user?.realName || user?.username}</Text>
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
            <Menu mode="inline" selectedKeys={getSelectedKey()} items={menuItems} />
          </Sider>
        )}
        <Content className="layout-content">
          <Routes>
            <Route path="workbench" element={<DoctorWorkbench />} />
            <Route path="patients" element={<DoctorWorkbench />} />
            <Route path="*" element={<DoctorWorkbench />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;

