import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Tag, Tabs } from 'antd';
import { getWaitingPatients, assignDoctor, getPendingOrders, addExecutionRecord, completeOrder, markOrderAbnormal } from '../../services/nurse';
import './NurseWorkbench.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

/**
 * 护士工作台
 */
const NurseWorkbench = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 分配医生模态框
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [assignForm] = Form.useForm();
  
  // 执行记录模态框
  const [executeModalVisible, setExecuteModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [executeForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [waitingRes, ordersRes] = await Promise.all([
        getWaitingPatients(),
        getPendingOrders()
      ]);
      
      if (waitingRes.data.success) {
        setWaitingList(waitingRes.data.data || []);
      }
      if (ordersRes.data.success) {
        setOrdersList(ordersRes.data.data || []);
      }
    } catch (error) {
      message.error('获取数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 分配医生
  const handleAssign = (patient) => {
    setCurrentPatient(patient);
    setAssignModalVisible(true);
    assignForm.resetFields();
  };

  const handleAssignSubmit = async () => {
    try {
      const values = await assignForm.validateFields();
      const res = await assignDoctor(currentPatient.id, values.doctorId);
      
      if (res.data.success) {
        message.success('医生分配成功');
        setAssignModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 执行医嘱
  const handleExecute = (order) => {
    setCurrentOrder(order);
    setExecuteModalVisible(true);
    executeForm.resetFields();
  };

  const handleExecuteSubmit = async () => {
    try {
      const values = await executeForm.validateFields();
      const res = await addExecutionRecord(currentOrder.id, values);
      
      if (res.data.success) {
        message.success('执行记录添加成功');
        setExecuteModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 标记完成
  const handleComplete = async (orderId) => {
    Modal.confirm({
      title: '确认完成？',
      content: '确认该医嘱已全部执行完成',
      onOk: async () => {
        try {
          const res = await completeOrder(orderId);
          if (res.data.success) {
            message.success('医嘱已标记为完成');
            fetchData();
          } else {
            message.error(res.data.message || '操作失败');
          }
        } catch (error) {
          message.error('操作失败');
          console.error(error);
        }
      }
    });
  };

  // 标记异常
  const handleAbnormal = async (orderId) => {
    Modal.confirm({
      title: '标记异常？',
      content: '该医嘱执行过程中出现异常情况',
      onOk: async () => {
        try {
          const res = await markOrderAbnormal(orderId);
          if (res.data.success) {
            message.success('已标记为异常');
            fetchData();
          } else {
            message.error(res.data.message || '操作失败');
          }
        } catch (error) {
          message.error('操作失败');
          console.error(error);
        }
      }
    });
  };

  // 待接诊患者列
  const waitingColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '病历号', dataIndex: 'medicalRecordNo', key: 'medicalRecordNo' },
    {
      title: '状态',
      dataIndex: 'customerStatus',
      key: 'customerStatus',
      render: (status) => <Tag color="blue">{status === 'PATIENT' ? '待接诊' : status}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAssign(record)}>分配医生</Button>
      )
    }
  ];

  // 待执行医嘱列
  const ordersColumns = [
    { title: '患者ID', dataIndex: 'customerId', key: 'customerId' },
    { title: '病历ID', dataIndex: 'medicalRecordId', key: 'medicalRecordId' },
    { title: '医生ID', dataIndex: 'doctorId', key: 'doctorId' },
    {
      title: '医嘱状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        const colorMap = {
          'PENDING': 'orange',
          'IN_PROGRESS': 'processing',
          'COMPLETED': 'success',
          'ABNORMAL': 'error'
        };
        const textMap = {
          'PENDING': '待执行',
          'IN_PROGRESS': '执行中',
          'COMPLETED': '已完成',
          'ABNORMAL': '异常'
        };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      }
    },
    { title: '下达时间', dataIndex: 'sentAt', key: 'sentAt' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          {record.orderStatus === 'PENDING' && (
            <Button type="link" onClick={() => handleExecute(record)}>执行</Button>
          )}
          {(record.orderStatus === 'PENDING' || record.orderStatus === 'IN_PROGRESS') && (
            <>
              <Button type="link" onClick={() => handleComplete(record.id)}>完成</Button>
              <Button type="link" danger onClick={() => handleAbnormal(record.id)}>异常</Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="nurse-workbench">
      <h2>护士工作台</h2>

      <Tabs defaultActiveKey="1">
        <TabPane tab={`待接诊患者 (${waitingList.length})`} key="1">
          <Table
            dataSource={waitingList}
            columns={waitingColumns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab={`待执行医嘱 (${ordersList.length})`} key="2">
          <Table
            dataSource={ordersList}
            columns={ordersColumns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* 分配医生模态框 */}
      <Modal
        title="分配医生"
        open={assignModalVisible}
        onOk={handleAssignSubmit}
        onCancel={() => setAssignModalVisible(false)}
      >
        <Form form={assignForm} layout="vertical">
          <Form.Item label="选择医生" name="doctorId" rules={[{ required: true, message: '请选择医生' }]}>
            <Select placeholder="请选择医生">
              <Option value={2}>医生A</Option>
              <Option value={3}>医生B</Option>
              <Option value={4}>医生C</Option>
            </Select>
          </Form.Item>
        </Form>
        <div style={{ color: '#999', fontSize: 12 }}>
          * 实际使用时需要从系统动态获取医生列表
        </div>
      </Modal>

      {/* 执行记录模态框 */}
      <Modal
        title="添加执行记录"
        open={executeModalVisible}
        onOk={handleExecuteSubmit}
        onCancel={() => setExecuteModalVisible(false)}
      >
        <Form form={executeForm} layout="vertical">
          <Form.Item 
            label="执行内容" 
            name="executionContent" 
            rules={[{ required: true, message: '请输入执行内容' }]}
          >
            <TextArea rows={3} placeholder="详细描述执行的操作" />
          </Form.Item>
          <Form.Item 
            label="执行状态" 
            name="executionStatus" 
            rules={[{ required: true, message: '请选择执行状态' }]}
            initialValue="NORMAL"
          >
            <Select>
              <Option value="NORMAL">正常</Option>
              <Option value="ABNORMAL">异常</Option>
            </Select>
          </Form.Item>
          <Form.Item label="异常描述" name="abnormalDescription">
            <TextArea rows={2} placeholder="如果有异常，请详细描述" />
          </Form.Item>
          <Form.Item label="患者反应" name="patientReaction">
            <TextArea rows={2} placeholder="患者的反应和感受" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NurseWorkbench;

