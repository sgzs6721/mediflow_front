import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Select, message, Result } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { register as registerApi } from '../../services/auth';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './Register.css';

const { Title, Text, Link } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await registerApi(values);
      setSuccess(true);
      message.success('注册申请已提交！');
    } catch (error) {
      message.error(error.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <Card className="register-card" style={{ width: isMobile ? '90%' : 500 }}>
          <Result
            status="success"
            title="注册申请已提交！"
            subTitle="请等待管理员审核，审核通过后即可登录系统。"
            extra={[
              <Button type="primary" key="login" onClick={() => navigate('/login')}>
                返回登录
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="register-container">
      <Card 
        className="register-card" 
        style={{ width: isMobile ? '90%' : 500 }}
      >
        <div className="register-header">
          <Title level={2}>用户注册</Title>
          <Text type="secondary">提交申请后需等待管理员审核</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { 
                pattern: /^[a-zA-Z0-9_]{4,20}$/, 
                message: '用户名只能包含字母、数字、下划线，长度4-20位' 
              },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
                message: '密码至少8位，且包含大小写字母和数字' 
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名！' }]}
          >
            <Input 
              prefix={<IdcardOutlined />} 
              placeholder="请输入真实姓名" 
            />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="phone"
            rules={[
              { 
                pattern: /^1[3-9]\d{9}$/, 
                message: '请输入正确的手机号' 
              },
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="请输入联系电话" 
            />
          </Form.Item>

          <Form.Item
            label="申请角色"
            name="appliedRole"
            rules={[{ required: true, message: '请选择申请角色！' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="BUSINESS">普通商务</Option>
              <Option value="DOCTOR">医生</Option>
              <Option value="NURSE">护士</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="申请理由"
            name="reason"
          >
            <TextArea 
              rows={4} 
              placeholder="请简要说明申请理由（可选）" 
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              提交申请
            </Button>
          </Form.Item>
        </Form>

        <div className="register-footer">
          <Text type="secondary">
            已有账号？
            <Link onClick={() => navigate('/login')}> 立即登录</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;

