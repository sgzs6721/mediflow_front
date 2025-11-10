import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, Modal, message, Card, Row, Col, List } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getCustomers, deleteCustomer, updateCustomer } from '../../services/customer';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import CreateCustomerModal from '../../components/CreateCustomerModal';
import './CustomerList.css';

const { Option } = Select;

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { isMobile } = useMediaQuery();
  const navigate = useNavigate();

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getCustomers({ keyword, status });
      setData(result || []);
    } catch (error) {
      message.error('加载失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [keyword, status]);

  // 删除客户
  const handleDelete = (id, name) => {
    Modal.confirm({
      title: '确认删除？',
      content: `确定要删除客户"${name}"吗？此操作不可恢复。`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCustomer(id);
          message.success('删除成功');
          loadData();
        } catch (error) {
          message.error('删除失败：' + error.message);
        }
      },
    });
  };

  // 客户状态映射
  const statusMap = {
    LEAD: { text: '潜在客户', color: 'default' },
    PATIENT: { text: '正式患者', color: 'blue' },
    IN_TREATMENT: { text: '治疗中', color: 'green' },
    COMPLETED: { text: '已完成', color: 'gray' },
  };

  // 移除了 columns 定义

  return (
    <div className="customer-list">
      <Card
        title="客户管理"
        style={{ marginLeft: 0, marginRight: 0 }}
        bodyStyle={{ padding: '16px' }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新增客户
          </Button>
        }
      >
        {/* 搜索栏 */}
        <Row gutter={[16, 16]} className="search-bar" justify="start" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Input
              placeholder="搜索客户姓名、电话、公司"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Select
              placeholder="客户状态"
              style={{ width: '100%' }}
              value={status || undefined}
              onChange={setStatus}
              allowClear
            >
              <Option value="LEAD">潜在客户</Option>
              <Option value="PATIENT">正式患者</Option>
              <Option value="IN_TREATMENT">治疗中</Option>
              <Option value="COMPLETED">已完成</Option>
            </Select>
          </Col>
        </Row>

        {/* 客户列表 */}
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.name}
                actions={[
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/business/customers/${item.id}`)}
                  >
                    查看详情
                  </Button>,
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingCustomer(item);
                      setEditModalVisible(true);
                    }}
                  >
                    编辑
                  </Button>,
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <p><strong>性别:</strong> {item.gender || '-'}</p>
                <p><strong>电话:</strong> {item.phone || '-'}</p>
                <p><strong>公司:</strong> {item.companyName || '-'}</p>
                <p><strong>状态:</strong> <Tag color={statusMap[item.customerStatus]?.color || 'default'}>{statusMap[item.customerStatus]?.text || item.customerStatus}</Tag></p>
                <p><strong>病历号:</strong> {item.medicalRecordNo || '-'}</p>
                <p><strong>创建时间:</strong> {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* 创建客户弹窗 */}
      <CreateCustomerModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          loadData();
        }}
      />
      {/* 编辑客户弹窗 */}
      <CreateCustomerModal
        visible={editModalVisible}
        mode="edit"
        initialValues={editingCustomer || {}}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingCustomer(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setEditingCustomer(null);
          loadData();
        }}
      />
    </div>
  );
};

export default CustomerList;

