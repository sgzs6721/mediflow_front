import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Tag, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getWaitingQueue, getMyPatients, createMedicalRecord, addPrescription, sendMedicalOrder } from '../../services/doctor';
import { createPhysicalExam } from '../../services/physical-exam';
import './DoctorWorkbench.css';

const { TabPane } = Tabs;
const { TextArea } = Input;

/**
 * 医生工作台
 */
const DoctorWorkbench = () => {
  const [queueList, setQueueList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 病历模态框
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [recordForm] = Form.useForm();
  
  // 体检模态框
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [examForm] = Form.useForm();
  
  // 处方模态框
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [prescriptionForm] = Form.useForm();
  const [currentRecordId, setCurrentRecordId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [queueRes, patientsRes] = await Promise.all([
        getWaitingQueue(),
        getMyPatients()
      ]);
      
      if (queueRes.data.success) {
        setQueueList(queueRes.data.data || []);
      }
      if (patientsRes.data.success) {
        setPatientList(patientsRes.data.data || []);
      }
    } catch (error) {
      message.error('获取数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 创建病历
  const handleCreateRecord = (customer) => {
    setCurrentCustomer(customer);
    setRecordModalVisible(true);
    recordForm.resetFields();
  };

  const handleRecordSubmit = async () => {
    try {
      const values = await recordForm.validateFields();
      values.customerId = currentCustomer.id;
      
      const res = await createMedicalRecord(values);
      if (res.data.success) {
        message.success('病历创建成功');
        setRecordModalVisible(false);
        setCurrentRecordId(res.data.data.id);
        fetchData();
      } else {
        message.error(res.data.message || '创建失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 录入体检数据
  const handleCreateExam = (customer) => {
    setCurrentCustomer(customer);
    setExamModalVisible(true);
    examForm.resetFields();
  };

  const handleExamSubmit = async () => {
    try {
      const values = await examForm.validateFields();
      values.customerId = currentCustomer.id;
      
      const res = await createPhysicalExam(values);
      if (res.data.success) {
        message.success('体检记录创建成功，BMI已自动计算');
        setExamModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '创建失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 开具处方
  const handleAddPrescription = (customer, recordId) => {
    setCurrentCustomer(customer);
    setCurrentRecordId(recordId);
    setPrescriptionModalVisible(true);
    prescriptionForm.resetFields();
  };

  const handlePrescriptionSubmit = async () => {
    try {
      const values = await prescriptionForm.validateFields();
      values.medicalRecordId = currentRecordId;
      values.customerId = currentCustomer.id;
      
      const res = await addPrescription(values);
      if (res.data.success) {
        message.success('处方添加成功');
        setPrescriptionModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '添加失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 发送医嘱（闸门2）
  const handleSendOrder = async (recordId) => {
    Modal.confirm({
      title: '确认发送医嘱？',
      content: '医嘱发送后将推送到护士工作台，无法撤回',
      onOk: async () => {
        try {
          const res = await sendMedicalOrder(recordId);
          if (res.data.success) {
            message.success('医嘱已下达！已推送到护士工作台');
            fetchData();
          } else {
            message.error(res.data.message || '发送失败');
          }
        } catch (error) {
          message.error('发送失败');
          console.error(error);
        }
      }
    });
  };

  // 待诊队列列
  const queueColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '性别', dataIndex: 'gender', key: 'gender' },
    { title: '病历号', dataIndex: 'medicalRecordNo', key: 'medicalRecordNo' },
    {
      title: '状态',
      dataIndex: 'customerStatus',
      key: 'customerStatus',
      render: (status) => {
        const colorMap = { 'PATIENT': 'blue', 'IN_TREATMENT': 'green' };
        const textMap = { 'PATIENT': '待诊', 'IN_TREATMENT': '治疗中' };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleCreateRecord(record)}>创建病历</Button>
          <Button type="link" onClick={() => handleCreateExam(record)}>录入体检</Button>
        </div>
      )
    }
  ];

  // 我的患者列
  const patientColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '病历号', dataIndex: 'medicalRecordNo', key: 'medicalRecordNo' },
    { title: '状态', dataIndex: 'customerStatus', key: 'customerStatus' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleCreateRecord(record)}>新建病历</Button>
          <Button type="link" onClick={() => handleAddPrescription(record, null)}>开处方</Button>
        </div>
      )
    }
  ];

  return (
    <div className="doctor-workbench">
      <h2>医生工作台</h2>

      <Tabs defaultActiveKey="1">
        <TabPane tab={`待诊队列 (${queueList.length})`} key="1">
          <Table
            dataSource={queueList}
            columns={queueColumns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane tab={`我的患者 (${patientList.length})`} key="2">
          <Table
            dataSource={patientList}
            columns={patientColumns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* 创建病历模态框 */}
      <Modal
        title="创建病历"
        open={recordModalVisible}
        onOk={handleRecordSubmit}
        onCancel={() => setRecordModalVisible(false)}
        width={800}
      >
        <Form form={recordForm} layout="vertical">
          <Form.Item label="主诉" name="chiefComplaint" rules={[{ required: true, message: '请输入主诉' }]}>
            <TextArea rows={2} placeholder="患者主要症状" />
          </Form.Item>
          <Form.Item label="现病史" name="presentIllness">
            <TextArea rows={3} placeholder="详细描述病史" />
          </Form.Item>
          <Form.Item label="既往史" name="pastHistory">
            <TextArea rows={2} placeholder="既往疾病史" />
          </Form.Item>
          <Form.Item label="过敏史" name="allergyHistory">
            <TextArea rows={2} placeholder="药物/食物过敏情况" />
          </Form.Item>
          <Form.Item label="诊断结论" name="diagnosisConclusion" rules={[{ required: true, message: '请输入诊断结论' }]}>
            <TextArea rows={2} placeholder="初步诊断" />
          </Form.Item>
          <Form.Item label="诊断依据" name="diagnosisBasis">
            <TextArea rows={2} placeholder="诊断依据" />
          </Form.Item>
          <Form.Item label="治疗方案名称" name="treatmentPlanName">
            <Input placeholder="治疗方案名称" />
          </Form.Item>
          <Form.Item label="治疗周期（天）" name="treatmentCycle">
            <InputNumber min={1} placeholder="治疗周期" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="治疗频率" name="treatmentFrequency">
            <Input placeholder="如：每天一次" />
          </Form.Item>
          <Form.Item label="治疗说明" name="treatmentDescription">
            <TextArea rows={3} placeholder="详细治疗说明" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 体检记录模态框 */}
      <Modal
        title="录入体检数据"
        open={examModalVisible}
        onOk={handleExamSubmit}
        onCancel={() => setExamModalVisible(false)}
      >
        <Form form={examForm} layout="vertical">
          <Form.Item label="身高 (cm)" name="height" rules={[{ required: true, message: '请输入身高' }]}>
            <InputNumber min={50} max={250} placeholder="身高" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="体重 (kg)" name="weight" rules={[{ required: true, message: '请输入体重' }]}>
            <InputNumber min={20} max={300} placeholder="体重" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="收缩压 (mmHg)" name="systolicPressure">
            <InputNumber min={60} max={220} placeholder="收缩压" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="舒张压 (mmHg)" name="diastolicPressure">
            <InputNumber min={40} max={150} placeholder="舒张压" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="心率 (次/分)" name="heartRate">
            <InputNumber min={40} max={180} placeholder="心率" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
        <div style={{ color: '#999', fontSize: 12 }}>* BMI将自动计算</div>
      </Modal>

      {/* 处方模态框 */}
      <Modal
        title="开具处方"
        open={prescriptionModalVisible}
        onOk={handlePrescriptionSubmit}
        onCancel={() => setPrescriptionModalVisible(false)}
      >
        <Form form={prescriptionForm} layout="vertical">
          <Form.Item label="药品名称" name="drugName" rules={[{ required: true, message: '请输入药品名称' }]}>
            <Input placeholder="药品名称" />
          </Form.Item>
          <Form.Item label="规格" name="specification">
            <Input placeholder="如：0.5g/片" />
          </Form.Item>
          <Form.Item label="用法" name="usageMethod" rules={[{ required: true, message: '请选择用法' }]}>
            <Input placeholder="ORAL/INJECTION/EXTERNAL" />
          </Form.Item>
          <Form.Item label="用量" name="dosage" rules={[{ required: true, message: '请输入用量' }]}>
            <Input placeholder="如：2片" />
          </Form.Item>
          <Form.Item label="频次" name="frequency" rules={[{ required: true, message: '请输入频次' }]}>
            <Input placeholder="如：每日3次" />
          </Form.Item>
          <Form.Item label="疗程（天）" name="duration" rules={[{ required: true, message: '请输入疗程' }]}>
            <InputNumber min={1} placeholder="疗程天数" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注" name="notes">
            <TextArea rows={2} placeholder="用药注意事项" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorWorkbench;

