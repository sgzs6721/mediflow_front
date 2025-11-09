import React, { useState, useEffect } from 'react';
import { Card, Select, Button, message, Tag, Space, Collapse, Divider, Typography } from 'antd'; // 移除 Table，添加 Collapse, Divider, Typography
import { ReloadOutlined } from '@ant-design/icons';
import { getAllPermissions, updatePermission, clearCache } from '../../services/permission';
import './PermissionManagement.css';

const { Option } = Select;
const { Panel } = Collapse;
const { Text } = Typography;

/**
 * 权限配置管理页面
 */
const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupedPermissions, setGroupedPermissions] = useState({}); // 按角色分组的权限数据

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    // 将扁平权限数据按角色分组
    const grouped = permissions.reduce((acc, permission) => {
      const { roleName, dataCategory } = permission;
      if (!acc[roleName]) {
        acc[roleName] = {};
      }
      if (!acc[roleName][dataCategory]) {
        acc[roleName][dataCategory] = [];
      }
      acc[roleName][dataCategory].push(permission);
      return acc;
    }, {});
    setGroupedPermissions(grouped);
  }, [permissions]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await getAllPermissions();
      if (res && res.success) {
        setPermissions(res.data || []);
      } else {
        message.error((res && res.message) || '获取权限配置失败');
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
      if (res && res.success) {
        message.success('权限更新成功');
        fetchPermissions();
      } else {
        message.error((res && res.message) || '更新失败');
      }
    } catch (error) {
      message.error('更新失败');
      console.error(error);
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await clearCache();
      if (res && res.success) {
        message.success('权限缓存已清除');
      } else {
        message.error((res && res.message) || '清除失败');
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

  // 移除了 columns 定义

  const roleTextMap = {
    'BUSINESS': '普通商务',
    'BUSINESS_ADMIN': '商务管理员',
    'DOCTOR': '医生',
    'NURSE': '护士',
    'ADMIN': '系统管理员'
  };

  const categoryTextMap = {
    'basic_info': '基础信息',
    'business_crm': '商务CRM',
    'financial': '财务订单',
    'appointment': '预约',
    'medical_core': '医疗核心',
    'status_sync': '状态同步'
  };

  return (
    <div className="permission-management">
      <Card 
        title="权限配置管理"
        extra={
          <Space>
            {/* 移除了角色筛选 Select */}
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

        <Collapse accordion loading={loading}> {/* 使用 Collapse 进行分组 */}
          {Object.entries(groupedPermissions).map(([roleName, categories]) => (
            <Panel 
              header={<Tag color="blue">{roleTextMap[roleName] || roleName}</Tag>} 
              key={roleName}
            >
              {Object.entries(categories).map(([dataCategory, permissionsInCategories]) => (
                <div key={dataCategory} className="permission-category-group">
                  <Divider orientation="left">
                    <Tag color="purple">{categoryTextMap[dataCategory] || dataCategory}</Tag>
                  </Divider>
                  {permissionsInCategories.map((permission) => (
                    <Space key={permission.id} className="permission-item">
                      <Text strong>{permission.dataField}</Text>
                      <Select
                        value={permission.permissionType}
                        style={{ width: 120 }}
                        onChange={(value) => handleUpdatePermission(permission.id, value)}
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
                    </Space>
                  ))}
                </div>
              ))}
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
};

export default PermissionManagement;

