import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, changePassword } from '../../services/auth';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileChanged, setProfileChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        username: user.username,
        realName: user.realName,
        phone: user.phone,
      });
    }
  }, [user, profileForm]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const values = await profileForm.validateFields();
      await updateProfile(values);
      updateUser({ ...user, ...values });
      message.success('个人信息更新成功');
      setProfileChanged(false);
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error('更新失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await passwordForm.validateFields();
      await changePassword(values);
      message.success('密码修改成功');
      passwordForm.resetFields();
      setPasswordChanged(false);
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error('修改失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 统一的确认修改处理
  const handleConfirm = async () => {
    if (activeTab === 'profile') {
      await handleUpdateProfile();
    } else {
      await handleChangePassword();
    }
  };

  // 检查按钮是否应该禁用
  const isButtonDisabled = () => {
    if (activeTab === 'profile') {
      return !profileChanged;
    } else {
      return !passwordChanged;
    }
  };

  const tabItems = [
    {
      key: 'profile',
      label: '个人信息',
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          style={{ maxWidth: 600 }}
          onValuesChange={() => setProfileChanged(true)}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input disabled prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          style={{ maxWidth: 600 }}
          onValuesChange={() => setPasswordChanged(true)}
        >
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: '2px' }}>
      <Card
        title={<div style={{ textAlign: 'center' }}>个人信息</div>}
      >
        <Tabs 
          items={tabItems} 
          activeKey={activeTab}
          onChange={setActiveTab}
        />

        {/* 底部按钮行 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button onClick={() => navigate(-1)}>
            返回
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirm} 
            loading={loading}
            disabled={isButtonDisabled()}
          >
            确认修改
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PersonalInfo;
