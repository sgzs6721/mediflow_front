import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { login as loginApi } from '../../services/auth';
import { ROLE_HOME_ROUTES } from '../../config/api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './Login.css';

const { Title, Text, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await loginApi(values.username, values.password);
      
      // 保存token和用户信息
      login(response.token, {
        username: response.username,
        realName: response.realName,
        role: response.role,
      });

      message.success('登录成功！');

      // 根据角色跳转到对应首页
      const homeRoute = ROLE_HOME_ROUTES[response.role] || '/';
      navigate(homeRoute, { replace: true });
    } catch (error) {
      message.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card 
        className="login-card" 
        style={{ width: isMobile ? '90%' : 400 }}
      >
        <div className="login-header">
          <Title level={2}>MediFlow</Title>
          <Text type="secondary">客户全周期管理系统</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary">
            还没有账号？
            <Link onClick={() => navigate('/register')}> 立即注册</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;

