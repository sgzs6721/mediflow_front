import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, message } from 'antd';
import { createAppointment } from '../services/appointment';
import dayjs from 'dayjs';

const CreateAppointmentModal = ({ visible, onCancel, onSuccess, customerId, customerName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const { appointmentDate, appointmentTime, purpose } = values;

      // 组合日期和时间，格式为 yyyy-MM-dd HH:mm:ss
      const dateStr = dayjs(appointmentDate).format('YYYY-MM-DD');
      const timeStr = dayjs(appointmentTime).format('HH:mm:ss');
      
      const appointmentData = {
        customerId: customerId,
        appointmentTime: `${dateStr} ${timeStr}`,
        appointmentPurpose: purpose
      };

      console.log('发送的预约数据：', appointmentData);
      console.log('customerId:', customerId);
      console.log('appointmentTime:', appointmentData.appointmentTime);

      const result = await createAppointment(appointmentData);

      if (result.success) {
        message.success('预约创建成功');
        form.resetFields();
        onSuccess && onSuccess(result.data);
        onCancel();
      } else {
        message.error(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建预约失败:', error);
      if (error.errorFields) {
        message.warning('请填写完整信息');
      } else {
        message.error('创建预约失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`为 ${customerName} 创建预约`}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="创建"
      cancelText="取消"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="appointmentDate"
          label="预约日期"
          rules={[{ required: true, message: '请选择预约日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder="选择预约日期"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            inputReadOnly
          />
        </Form.Item>

        <Form.Item
          name="appointmentTime"
          label="预约时间"
          rules={[{ required: true, message: '请选择预约时间' }]}
          initialValue={dayjs('09:00', 'HH:mm')}
        >
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            placeholder="选择预约时间"
            inputReadOnly
          />
        </Form.Item>

        <Form.Item
          name="purpose"
          label="预约事项"
          rules={[
            { required: true, message: '请输入预约事项' },
            { max: 200, message: '内容不能超过200个字符' }
          ]}
        >
          <Input.TextArea
            placeholder="请输入预约事项说明"
            rows={4}
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppointmentModal;
