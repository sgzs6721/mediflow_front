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
    <div className="permission-management" style={{padding: 0}}>
      <Card  style={{ marginLeft: 0, marginRight: 0 }} title="权限配置管理">
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>权限类型：可编辑/只读/无权限（按岗位和字段分配）</div>
        <Collapse accordion>
          {Object.entries(groupedPermissions || {})
            .filter(([roleName, categories]) => !!roleName && categories && Object.keys(categories).length > 0)
            .map(([roleName, categories]) => (
              <Panel 
                header={<div className="category-header-center">{roleTextMap[roleName] ? <Tag color="blue">{roleTextMap[roleName] || roleName}</Tag> : roleTextMap[roleName] || roleName}</div>} 
                key={roleName}
              >
                {Object.entries(categories)
                  .filter(([dataCategory, permissionsInCategories]) => !!dataCategory && permissionsInCategories && permissionsInCategories.length > 0)
                  .map(([dataCategory, permissionsInCategories]) => (
                    <div key={dataCategory} className="permission-category-group">
                      <Divider orientation="center">
                        <div className="category-header-center">
                          <Tag color="purple">{categoryTextMap[dataCategory] || dataCategory}</Tag>
                        </div>
                      </Divider>
                      <div className="permission-items-grid">
                        {permissionsInCategories.map((permission) => (
                          <div key={permission.id} className="permission-item-box">
                            <Space className="permission-item" style={{width:'100%'}}>
                              <Text strong>{permission.dataField}</Text>
                              <Select
                                value={permission.permissionType}
                                style={{ width: 120 }}
                                onChange={(value) => handleUpdatePermission(permission.id, value)}
                              >
                                <Option value="EDITABLE">可编辑</Option>
                                <Option value="READONLY">只读</Option>
                                <Option value="NONE">无权限</Option>
                              </Select>
                            </Space>
                          </div>
                        ))}
                      </div>
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

