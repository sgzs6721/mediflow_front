import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tabs, Table, Tag, Spin, Button, message, Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { LeftCircleOutlined, PlusOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import './CustomerDetail.css';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

/**
 * 客户360°详情页
 */
const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [followUpForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [treatmentItems, setTreatmentItems] = useState([{ name: '', quantity: 1, price: 0 }]);

  useEffect(() => {
    fetchCustomer360();
  }, [id]);

  const fetchCustomer360 = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/business/customers/${id}/360-view`);
      
      if (response.success) {
        setData(response.data);
      } else {
        message.error(response.message || '获取客户信息失败');
      }
    } catch (error) {
      console.error('获取客户360视图失败:', error);
      // Error message already shown by request interceptor
    } finally {
      setLoading(false);
    }
  };

  // 创建跟进记录
  const handleCreateFollowUp = async (values) => {
    try {
      setSubmitting(true);
      const response = await request.post(`/business/customers/${id}/follow-ups`, {
        customerId: parseInt(id),
        visitTime: values.visitTime.format('YYYY-MM-DD HH:mm:ss'),
        visitMethod: values.visitMethod,
        visitContent: values.visitContent,
        nextFollowUpTime: values.nextFollowUpTime ? values.nextFollowUpTime.format('YYYY-MM-DD HH:mm:ss') : null
      });
      
      if (response.success) {
        message.success('跟进记录创建成功');
        setFollowUpModalVisible(false);
        followUpForm.resetFields();
        fetchCustomer360(); // 刷新数据
      } else {
        message.error(response.message || '创建跟进记录失败');
      }
    } catch (error) {
      console.error('创建跟进记录失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 创建订单
  const handleCreateOrder = async (values) => {
    try {
      setSubmitting(true);
      
      // 计算订单总金额
      const totalAmount = treatmentItems.reduce((sum, item) => {
        return sum + (item.quantity || 0) * (item.price || 0);
      }, 0);
      
      const response = await request.post(`/business/customers/${id}/orders`, {
        customerId: parseInt(id),
        treatmentItems: treatmentItems.filter(item => item.name && item.quantity && item.price),
        orderAmount: totalAmount
      });
      
      if (response.success) {
        message.success('订单创建成功');
        setOrderModalVisible(false);
        orderForm.resetFields();
        setTreatmentItems([{ name: '', quantity: 1, price: 0 }]);
        fetchCustomer360(); // 刷新数据
      } else {
        message.error(response.message || '创建订单失败');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 添加治疗项目
  const addTreatmentItem = () => {
    setTreatmentItems([...treatmentItems, { name: '', quantity: 1, price: 0 }]);
  };

  // 删除治疗项目
  const removeTreatmentItem = (index) => {
    const newItems = treatmentItems.filter((_, i) => i !== index);
    setTreatmentItems(newItems.length > 0 ? newItems : [{ name: '', quantity: 1, price: 0 }]);
  };

  // 更新治疗项目
  const updateTreatmentItem = (index, field, value) => {
    const newItems = [...treatmentItems];
    newItems[index][field] = value;
    setTreatmentItems(newItems);
  };

  // 计算订单总金额
  const calculateTotalAmount = () => {
    return treatmentItems.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.price || 0);
    }, 0);
  };

  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  if (!data) {
    return <div>客户不存在</div>;
  }

  const { customer, followUpRecords, orders, latestExamination, latestMedicalRecord, totalOrders, totalAmount, totalFollowUps } = data;

  // 客户状态映射
  const statusMap = {
    'LEAD': { text: '潜在客户', color: 'default' },
    'PATIENT': { text: '正式患者', color: 'blue' },
    'IN_TREATMENT': { text: '治疗中', color: 'green' },
    'COMPLETED': { text: '已完成', color: 'success' }
  };

  // 跟进记录列
  const followUpColumns = [
    { title: '跟进时间', dataIndex: 'visitTime', key: 'visitTime' },
    { 
      title: '跟进方式', 
      dataIndex: 'visitMethod', 
      key: 'visitMethod',
      render: (method) => {
        const methodMap = { 'PHONE': '电话', 'ONSITE': '现场', 'ONLINE': '线上' };
        return methodMap[method] || method;
      }
    },
    { title: '跟进内容', dataIndex: 'visitContent', key: 'visitContent' },
    { title: '下次跟进', dataIndex: 'nextFollowUpTime', key: 'nextFollowUpTime' }
  ];

  // 订单列
  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '订单金额', dataIndex: 'orderAmount', key: 'orderAmount', render: (val) => `¥${val}` },
    { title: '实收金额', dataIndex: 'paidAmount', key: 'paidAmount', render: (val) => val ? `¥${val}` : '-' },
    { 
      title: '订单状态', 
      dataIndex: 'orderStatus', 
      key: 'orderStatus',
      render: (status) => {
        const statusMap = { 'PENDING': { text: '待支付', color: 'default' }, 'PAID': { text: '已支付', color: 'success' }, 'CANCELLED': { text: '已取消', color: 'error' } };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text || status}</Tag>;
      }
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' }
  ];


  return (
    <div className="customer-detail-page">
      <Card
        title={
          <div className="detail-header">
            <Button 
              type="text"
              icon={<LeftCircleOutlined />} 
              onClick={() => navigate(-1)}
              className="back-button"
            />
            <span className="detail-title">客户详情</span>
            <div className="header-placeholder"></div>
          </div>
        }
      >
        {/* 客户基本信息 */}
        <div className="detail-section">
          <h3 className="section-title">客户基本信息</h3>
        <Descriptions column={2}>
          <Descriptions.Item label="姓名">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{customer.gender}</Descriptions.Item>
          <Descriptions.Item label="电话">
            <a href={`tel:${customer.phone}`} style={{ color: '#1890ff' }}>{customer.phone}</a>
          </Descriptions.Item>
          <Descriptions.Item label="身份证号">{customer.idCard || '-'}</Descriptions.Item>
          <Descriptions.Item label="客户状态">
            <Tag color={statusMap[customer.customerStatus]?.color}>
              {statusMap[customer.customerStatus]?.text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所在行业">{customer.industry || '-'}</Descriptions.Item>
          <Descriptions.Item label="公司名称">{customer.companyName || '-'}</Descriptions.Item>
          <Descriptions.Item label="资金实力">{customer.financialStrength || '-'}</Descriptions.Item>
          <Descriptions.Item label="客户需求" span={2}>{customer.customerNeeds || '-'}</Descriptions.Item>
          </Descriptions>
        </div>

        {/* 统计卡片 */}
        <div className="detail-section">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-item">
                <div className="stat-label">总订单数</div>
                <div className="stat-value">{totalOrders}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-item">
                <div className="stat-label">总消费金额</div>
                <div className="stat-value">¥{totalAmount}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-item">
                <div className="stat-label">总跟进次数</div>
                <div className="stat-value">{totalFollowUps}</div>
              </div>
            </div>
          </div>
        </div>

      {/* 详细信息Tab */}
      <div className="detail-section">
        <Tabs defaultActiveKey="1">
          <TabPane tab="跟进记录" key="1">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setFollowUpModalVisible(true)}
              >
                新增跟进
              </Button>
            </div>
            <Table 
              dataSource={followUpRecords} 
              columns={followUpColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="订单信息" key="2">
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setOrderModalVisible(true)}
              >
                新增订单
              </Button>
            </div>
            <Table 
              dataSource={orders} 
              columns={orderColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="体检数据" key="3">
            {latestExamination ? (
              <Descriptions column={2}>
                <Descriptions.Item label="身高">{latestExamination.height} cm</Descriptions.Item>
                <Descriptions.Item label="体重">{latestExamination.weight} kg</Descriptions.Item>
                <Descriptions.Item label="BMI">{latestExamination.bmi}</Descriptions.Item>
                <Descriptions.Item label="收缩压">{latestExamination.systolicPressure}</Descriptions.Item>
                <Descriptions.Item label="舒张压">{latestExamination.diastolicPressure}</Descriptions.Item>
                <Descriptions.Item label="心率">{latestExamination.heartRate}</Descriptions.Item>
                <Descriptions.Item label="体检时间" span={2}>{latestExamination.examTime}</Descriptions.Item>
              </Descriptions>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                暂无体检数据（由医疗系统录入）
              </div>
            )}
          </TabPane>
          
          <TabPane tab="治疗方案" key="4">
            {latestMedicalRecord ? (
              <Descriptions column={2}>
                <Descriptions.Item label="治疗方案名称" span={2}>{latestMedicalRecord.treatmentPlanName}</Descriptions.Item>
                <Descriptions.Item label="治疗周期">{latestMedicalRecord.treatmentCycle} 天</Descriptions.Item>
                <Descriptions.Item label="治疗频率">{latestMedicalRecord.treatmentFrequency}</Descriptions.Item>
                <Descriptions.Item label="治疗说明" span={2}>{latestMedicalRecord.treatmentDescription}</Descriptions.Item>
                <Descriptions.Item label="就诊时间" span={2}>{latestMedicalRecord.visitTime}</Descriptions.Item>
              </Descriptions>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                暂无治疗方案（由医疗系统录入）
              </div>
            )}
          </TabPane>
        </Tabs>
        </div>
      </Card>

      {/* 新增跟进记录弹窗 */}
      <Modal
        title="新增跟进记录"
        open={followUpModalVisible}
        onCancel={() => {
          setFollowUpModalVisible(false);
          followUpForm.resetFields();
        }}
        onOk={() => followUpForm.submit()}
        confirmLoading={submitting}
        width={600}
      >
        <Form
          form={followUpForm}
          layout="vertical"
          onFinish={handleCreateFollowUp}
        >
          <Form.Item
            name="visitTime"
            label="跟进时间"
            rules={[{ required: true, message: '请选择跟进时间' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }}
              placeholder="选择跟进时间"
            />
          </Form.Item>

          <Form.Item
            name="visitMethod"
            label="跟进方式"
            rules={[{ required: true, message: '请选择跟进方式' }]}
          >
            <Select placeholder="选择跟进方式">
              <Select.Option value="PHONE">电话</Select.Option>
              <Select.Option value="ONSITE">现场</Select.Option>
              <Select.Option value="ONLINE">线上</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="visitContent"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入跟进内容"
            />
          </Form.Item>

          <Form.Item
            name="nextFollowUpTime"
            label="下次跟进时间"
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm:ss" 
              style={{ width: '100%' }}
              placeholder="选择下次跟进时间（可选）"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增订单弹窗 */}
      <Modal
        title="新增订单"
        open={orderModalVisible}
        onCancel={() => {
          setOrderModalVisible(false);
          orderForm.resetFields();
          setTreatmentItems([{ name: '', quantity: 1, price: 0 }]);
        }}
        onOk={() => handleCreateOrder()}
        confirmLoading={submitting}
        width={700}
      >
        <Form
          form={orderForm}
          layout="vertical"
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>治疗项目</div>
            {treatmentItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Input
                  placeholder="项目名称"
                  value={item.name}
                  onChange={(e) => updateTreatmentItem(index, 'name', e.target.value)}
                  style={{ flex: 2 }}
                />
                <InputNumber
                  placeholder="数量"
                  min={1}
                  value={item.quantity}
                  onChange={(value) => updateTreatmentItem(index, 'quantity', value)}
                  style={{ width: 100 }}
                />
                <InputNumber
                  placeholder="单价"
                  min={0}
                  value={item.price}
                  onChange={(value) => updateTreatmentItem(index, 'price', value)}
                  style={{ width: 120 }}
                  prefix="¥"
                />
                <Button 
                  danger 
                  onClick={() => removeTreatmentItem(index)}
                  disabled={treatmentItems.length === 1}
                >
                  删除
                </Button>
              </div>
            ))}
            <Button 
              type="dashed" 
              onClick={addTreatmentItem} 
              style={{ width: '100%' }}
              icon={<PlusOutlined />}
            >
              添加项目
            </Button>
          </div>

          <div style={{ textAlign: 'right', fontSize: 16, fontWeight: 'bold', marginTop: 16 }}>
            订单总金额: ¥{calculateTotalAmount().toFixed(2)}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;

