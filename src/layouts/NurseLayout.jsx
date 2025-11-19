import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, MedicineBoxOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import NurseWorkbench from '../pages/Nurse/NurseWorkbench';
import PersonalInfo from '../pages/Business/PersonalInfo';
import '../layouts/BusinessLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const NurseLayout = () => {
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
      onClick: () => navigate('/nurse/profile'),
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

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/profile')) return [];
    if (path.includes('/workbench')) return ['workbench'];
    if (path.includes('/orders')) return ['orders'];
    return ['workbench'];
  };

  const getUserInitial = () => {
    const name = user?.realName || user?.username || '';
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = () => {
    const name = user?.realName || user?.username || '';
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Layout className="business-layout">
      <Header className="layout-header">
        <div className="logo">MediFlow - 护士端</div>
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
            <Menu mode="inline" selectedKeys={getSelectedKey()} items={menuItems} />
          </Sider>
        )}
        <Content className="layout-content">
          <Routes>
            <Route path="workbench" element={<NurseWorkbench />} />
            <Route path="orders" element={<NurseWorkbench />} />
            <Route path="profile" element={<PersonalInfo />} />
            <Route path="*" element={<NurseWorkbench />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NurseLayout;

