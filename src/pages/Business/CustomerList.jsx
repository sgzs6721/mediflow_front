import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, Modal, message, Card } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getCustomers, deleteCustomer } from '../../services/customer';
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

  const columns = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: isMobile ? undefined : 'left',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 60,
      render: (text) => text || '-',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'customerStatus',
      key: 'customerStatus',
      width: 100,
      render: (status) => {
        const config = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '病历号',
      dataIndex: 'medicalRecordNo',
      key: 'medicalRecordNo',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: isMobile ? undefined : 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/business/customers/${record.id}`)}
          >
            查看详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/business/customers/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.name)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="customer-list">
      <Card
        title="客户管理"
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
        <Space className="search-bar" wrap>
          <Input
            placeholder="搜索客户姓名、电话、公司"
            prefix={<SearchOutlined />}
            style={{ width: isMobile ? '100%' : 300 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
          />
          <Select
            placeholder="客户状态"
            style={{ width: isMobile ? '100%' : 150 }}
            value={status || undefined}
            onChange={setStatus}
            allowClear
          >
            <Option value="LEAD">潜在客户</Option>
            <Option value="PATIENT">正式患者</Option>
            <Option value="IN_TREATMENT">治疗中</Option>
            <Option value="COMPLETED">已完成</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={loadData}>
            刷新
          </Button>
        </Space>

        {/* 客户列表 */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: isMobile ? 1200 : undefined }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
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
    </div>
  );
};

export default CustomerList;

