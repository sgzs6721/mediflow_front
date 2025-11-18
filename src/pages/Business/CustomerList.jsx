import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, Modal, message, Card, Row, Col, List, Dropdown, Spin } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getCustomers, deleteCustomer, updateCustomer } from '../../services/customer';
import { getCustomerAppointments } from '../../services/appointment';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import CreateCustomerModal from '../../components/CreateCustomerModal';
import CreateAppointmentModal from '../../components/CreateAppointmentModal';
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
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [appointmentCustomer, setAppointmentCustomer] = useState(null);
  const [appointmentListVisible, setAppointmentListVisible] = useState(false);
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
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

  // 修改客户状态
  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await updateCustomer(customerId, { customerStatus: newStatus });
      message.success('状态修改成功');
      loadData();
    } catch (error) {
      message.error('状态修改失败：' + error.message);
    }
  };

  // 查看客户预约列表
  const handleViewAppointments = async (customer) => {
    setAppointmentCustomer(customer);
    setLoadingAppointments(true);
    setAppointmentListVisible(true);
    try {
      const response = await getCustomerAppointments(customer.id);
      if (response && response.success) {
        // 只显示待完成的预约
        const scheduledAppointments = (response.data || []).filter(
          apt => apt.appointmentStatus === 'SCHEDULED'
        );
        setCustomerAppointments(scheduledAppointments);
      } else {
        message.error('获取预约列表失败');
        setCustomerAppointments([]);
      }
    } catch (error) {
      message.error('获取预约列表失败：' + error.message);
      setCustomerAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
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
                className="customer-card"
              >
                <div className="customer-card-header">
                  <div className="customer-name">
                    <span 
                      className="name-text" 
                      onClick={() => navigate(`/business/customers/${item.id}`)}
                      style={{ cursor: 'pointer', color: '#1890ff' }}
                    >
                      {item.name}
                    </span>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'LEAD',
                            label: '潜在客户',
                            onClick: () => handleStatusChange(item.id, 'LEAD'),
                          },
                          {
                            key: 'PATIENT',
                            label: '正式患者',
                            onClick: () => handleStatusChange(item.id, 'PATIENT'),
                          },
                          {
                            key: 'IN_TREATMENT',
                            label: '治疗中',
                            onClick: () => handleStatusChange(item.id, 'IN_TREATMENT'),
                          },
                          {
                            key: 'COMPLETED',
                            label: '已完成',
                            onClick: () => handleStatusChange(item.id, 'COMPLETED'),
                          },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <Tag 
                        color={statusMap[item.customerStatus]?.color || 'default'}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {statusMap[item.customerStatus]?.text || item.customerStatus}
                      </Tag>
                    </Dropdown>
                  </div>
                  <div className="customer-actions" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'view',
                            label: '查看预约',
                            icon: <EyeOutlined />,
                            onClick: () => handleViewAppointments(item),
                            disabled: !item.appointmentCount || item.appointmentCount === 0,
                          },
                          {
                            key: 'create',
                            label: '新增预约',
                            icon: <PlusOutlined />,
                            onClick: () => {
                              setAppointmentCustomer(item);
                              setAppointmentModalVisible(true);
                            },
                          },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<CalendarOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.appointmentCount > 0 && (
                          <span style={{ 
                            marginLeft: 4, 
                            fontSize: 12, 
                            fontWeight: 'bold',
                            color: '#1890ff'
                          }}>
                            {item.appointmentCount}
                          </span>
                        )}
                      </Button>
                    </Dropdown>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingCustomer(item);
                        setEditModalVisible(true);
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(item.id, item.name)}
                    />
                  </div>
                </div>
                <div className="customer-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px' }}>
                    <div className="info-row">
                      <span className="info-label">电话</span>
                      <a href={`tel:${item.phone}`} className="info-value phone-link" onClick={(e) => e.stopPropagation()}>
                        {item.phone || '-'}
                      </a>
                    </div>
                    <div className="info-row">
                      <span className="info-label">行业</span>
                      <span className="info-value">{item.industry || '-'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">公司</span>
                      <span className="info-value">{item.companyName || '-'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">资金实力</span>
                      <span className="info-value">{item.financialStrength || '-'}</span>
                    </div>
                    <div className="info-row" style={{ gridColumn: '1 / -1' }}>
                      <span className="info-label">创建时间</span>
                      <span className="info-value">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                    </div>
                  </div>
                </div>
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
      
      {/* 预约弹窗 */}
      <CreateAppointmentModal
        visible={appointmentModalVisible}
        customerId={appointmentCustomer?.id}
        customerName={appointmentCustomer?.name}
        onCancel={() => {
          setAppointmentModalVisible(false);
          setAppointmentCustomer(null);
        }}
        onSuccess={() => {
          setAppointmentModalVisible(false);
          setAppointmentCustomer(null);
          message.success('预约创建成功');
          loadData();
        }}
      />

      {/* 预约列表弹窗 */}
      <Modal
        title={`${appointmentCustomer?.name} 的预约列表`}
        open={appointmentListVisible}
        onCancel={() => {
          setAppointmentListVisible(false);
          setCustomerAppointments([]);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setAppointmentListVisible(false);
            setCustomerAppointments([]);
          }}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <Spin spinning={loadingAppointments}>
          {customerAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              暂无待完成的预约
            </div>
          ) : (
            <List
              dataSource={customerAppointments}
              renderItem={(appointment) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined style={{ color: '#1890ff' }} />
                        <span style={{ fontWeight: 'bold', fontSize: 14 }}>
                          {dayjs(appointment.appointmentTime).format('YYYY-MM-DD HH:mm')}
                        </span>
                        <Tag color="blue">待完成</Tag>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: '#666', paddingLeft: 24 }}>
                      {appointment.appointmentPurpose || '无备注'}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default CustomerList;

