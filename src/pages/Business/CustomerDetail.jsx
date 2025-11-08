import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tabs, Table, Tag, Spin, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import './CustomerDetail.css';

const { TabPane } = Tabs;

/**
 * 客户360°详情页
 */
const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchCustomer360();
  }, [id]);

  const fetchCustomer360 = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:6066/mediflow/api/business/customers/${id}/360-view`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        message.error(response.data.message || '获取客户信息失败');
      }
    } catch (error) {
      message.error('获取客户信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  if (!data) {
    return <div>客户不存在</div>;
  }

  const { customer, followUpRecords, orders, latestExamination, latestMedicalRecord, appointments, totalOrders, totalAmount, totalFollowUps } = data;

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
    { title: '跟进方式', dataIndex: 'visitMethod', key: 'visitMethod' },
    { title: '跟进内容', dataIndex: 'visitContent', key: 'visitContent' },
    { title: '下次跟进', dataIndex: 'nextFollowUpTime', key: 'nextFollowUpTime' }
  ];

  // 订单列
  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '订单金额', dataIndex: 'orderAmount', key: 'orderAmount', render: (val) => `¥${val}` },
    { title: '实收金额', dataIndex: 'paidAmount', key: 'paidAmount', render: (val) => `¥${val}` },
    { 
      title: '订单状态', 
      dataIndex: 'orderStatus', 
      key: 'orderStatus',
      render: (status) => {
        const colorMap = { 'PENDING': 'default', 'PAID': 'success', 'CANCELLED': 'error' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' }
  ];

  // 预约列
  const appointmentColumns = [
    { title: '预约时间', dataIndex: 'appointmentTime', key: 'appointmentTime' },
    { title: '到院目的', dataIndex: 'appointmentPurpose', key: 'appointmentPurpose' },
    { 
      title: '状态', 
      dataIndex: 'appointmentStatus', 
      key: 'appointmentStatus',
      render: (status) => {
        const colorMap = { 'SCHEDULED': 'processing', 'COMPLETED': 'success', 'CANCELLED': 'default' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    { title: '备注', dataIndex: 'notes', key: 'notes' }
  ];

  return (
    <div className="customer-detail-page">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      {/* 客户基本信息 */}
      <Card title="客户基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="姓名">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{customer.gender}</Descriptions.Item>
          <Descriptions.Item label="电话">{customer.phone}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{customer.idCard}</Descriptions.Item>
          <Descriptions.Item label="病历号">
            <Tag color="blue">{customer.medicalRecordNo || '未生成'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="客户状态">
            <Tag color={statusMap[customer.customerStatus]?.color}>
              {statusMap[customer.customerStatus]?.text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所在行业">{customer.industry}</Descriptions.Item>
          <Descriptions.Item label="公司名称">{customer.companyName}</Descriptions.Item>
          <Descriptions.Item label="资金实力">{customer.financialStrength}</Descriptions.Item>
          <Descriptions.Item label="客户需求" span={3}>{customer.customerNeeds}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 统计卡片 */}
      <div className="stats-row" style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}>
          <div className="stat-item">
            <div className="stat-label">总订单数</div>
            <div className="stat-value">{totalOrders}</div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div className="stat-item">
            <div className="stat-label">总消费金额</div>
            <div className="stat-value">¥{totalAmount}</div>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div className="stat-item">
            <div className="stat-label">总跟进次数</div>
            <div className="stat-value">{totalFollowUps}</div>
          </div>
        </Card>
      </div>

      {/* 详细信息Tab */}
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="跟进记录" key="1">
            <Table 
              dataSource={followUpRecords} 
              columns={followUpColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane tab="订单信息" key="2">
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
                暂无体检数据
              </div>
            )}
          </TabPane>
          
          <TabPane tab="治疗方案" key="4">
            {latestMedicalRecord ? (
              <Descriptions column={1}>
                <Descriptions.Item label="治疗方案名称">{latestMedicalRecord.treatmentPlanName}</Descriptions.Item>
                <Descriptions.Item label="治疗周期">{latestMedicalRecord.treatmentCycle} 天</Descriptions.Item>
                <Descriptions.Item label="治疗频率">{latestMedicalRecord.treatmentFrequency}</Descriptions.Item>
                <Descriptions.Item label="治疗说明">{latestMedicalRecord.treatmentDescription}</Descriptions.Item>
                <Descriptions.Item label="就诊时间">{latestMedicalRecord.visitTime}</Descriptions.Item>
              </Descriptions>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                暂无治疗方案
              </div>
            )}
          </TabPane>
          
          <TabPane tab="预约信息" key="5">
            <Table 
              dataSource={appointments} 
              columns={appointmentColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerDetail;

