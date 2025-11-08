import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Button, message, Tag, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getAllPermissions, updatePermission, clearCache } from '../../services/permission';
import './PermissionManagement.css';

const { Option } = Select;

/**
 * 权限配置管理页面
 */
const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ALL');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await getAllPermissions();
      if (res.data.success) {
        setPermissions(res.data.data || []);
      } else {
        message.error(res.data.message || '获取权限配置失败');
      }
    } catch (error) {
      message.error('获取权限配置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermission = async (id, newType) => {
    try {
      const res = await updatePermission(id, newType);
      if (res.data.success) {
        message.success('权限更新成功');
        fetchPermissions();
      } else {
        message.error(res.data.message || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
      console.error(error);
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await clearCache();
      if (res.data.success) {
        message.success('权限缓存已清除');
      } else {
        message.error(res.data.message || '清除失败');
      }
    } catch (error) {
      message.error('清除失败');
      console.error(error);
    }
  };

  const getPermissionColor = (type) => {
    const colorMap = {
      'EDITABLE': 'success',
      'READONLY': 'processing',
      'NONE': 'default'
    };
    return colorMap[type] || 'default';
  };

  const getPermissionText = (type) => {
    const textMap = {
      'EDITABLE': '可编辑',
      'READONLY': '只读',
      'NONE': '无权限'
    };
    return textMap[type] || type;
  };

  const columns = [
    { 
      title: '角色', 
      dataIndex: 'roleName', 
      key: 'roleName',
      filters: [
        { text: 'BUSINESS', value: 'BUSINESS' },
        { text: 'BUSINESS_ADMIN', value: 'BUSINESS_ADMIN' },
        { text: 'DOCTOR', value: 'DOCTOR' },
        { text: 'NURSE', value: 'NURSE' },
        { text: 'ADMIN', value: 'ADMIN' }
      ],
      onFilter: (value, record) => record.roleName === value,
      render: (roleName) => {
        const roleTextMap = {
          'BUSINESS': '普通商务',
          'BUSINESS_ADMIN': '商务管理员',
          'DOCTOR': '医生',
          'NURSE': '护士',
          'ADMIN': '系统管理员'
        };
        return <Tag color="blue">{roleTextMap[roleName] || roleName}</Tag>;
      }
    },
    { 
      title: '数据大类', 
      dataIndex: 'dataCategory', 
      key: 'dataCategory',
      render: (category) => {
        const categoryTextMap = {
          'basic_info': '基础信息',
          'business_crm': '商务CRM',
          'financial': '财务订单',
          'appointment': '预约',
          'medical_core': '医疗核心',
          'status_sync': '状态同步'
        };
        return categoryTextMap[category] || category;
      }
    },
    { title: '数据字段', dataIndex: 'dataField', key: 'dataField' },
    {
      title: '权限类型',
      dataIndex: 'permissionType',
      key: 'permissionType',
      render: (type, record) => (
        <Select
          value={type}
          style={{ width: 120 }}
          onChange={(value) => handleUpdatePermission(record.id, value)}
        >
          <Option value="EDITABLE">
            <Tag color="success">可编辑</Tag>
          </Option>
          <Option value="READONLY">
            <Tag color="processing">只读</Tag>
          </Option>
          <Option value="NONE">
            <Tag color="default">无权限</Tag>
          </Option>
        </Select>
      )
    },
    { 
      title: '更新时间', 
      dataIndex: 'updatedAt', 
      key: 'updatedAt',
      render: (time) => time ? new Date(time).toLocaleString() : '-'
    }
  ];

  const filteredData = selectedRole === 'ALL' 
    ? permissions 
    : permissions.filter(p => p.roleName === selectedRole);

  return (
    <div className="permission-management">
      <Card 
        title="权限配置管理"
        extra={
          <Space>
            <Select
              value={selectedRole}
              style={{ width: 150 }}
              onChange={setSelectedRole}
            >
              <Option value="ALL">全部角色</Option>
              <Option value="BUSINESS">普通商务</Option>
              <Option value="BUSINESS_ADMIN">商务管理员</Option>
              <Option value="DOCTOR">医生</Option>
              <Option value="NURSE">护士</Option>
              <Option value="ADMIN">系统管理员</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={fetchPermissions}>刷新</Button>
            <Button onClick={handleClearCache}>清除缓存</Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Tag color="success">可编辑：可以查看和修改</Tag>
            <Tag color="processing">只读：只能查看不能修改</Tag>
            <Tag color="default">无权限：完全不可见</Tag>
          </Space>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
};

export default PermissionManagement;

