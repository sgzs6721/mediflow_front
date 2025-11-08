import { Modal, Form, Input, Select, message } from 'antd';
import { createCustomer } from '../services/customer';

const { TextArea } = Input;
const { Option } = Select;

const CreateCustomerModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createCustomer(values);
      message.success('客户创建成功');
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error('创建失败：' + error.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="新增客户"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="客户姓名"
          name="name"
          rules={[{ required: true, message: '请输入客户姓名' }]}
        >
          <Input placeholder="请输入客户姓名" />
        </Form.Item>

        <Form.Item label="性别" name="gender">
          <Select placeholder="请选择性别">
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="联系电话"
          name="phone"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item label="身份证号" name="idCard">
          <Input placeholder="请输入身份证号" />
        </Form.Item>

        <Form.Item label="所在行业" name="industry">
          <Select placeholder="请选择行业">
            <Option value="互联网">互联网</Option>
            <Option value="金融">金融</Option>
            <Option value="制造业">制造业</Option>
            <Option value="服务业">服务业</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item label="公司名称" name="companyName">
          <Input placeholder="请输入公司名称" />
        </Form.Item>

        <Form.Item label="资金实力" name="financialStrength">
          <Select placeholder="请选择资金实力">
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
            <Option value="D">D级</Option>
          </Select>
        </Form.Item>

        <Form.Item label="客户需求" name="customerNeeds">
          <TextArea rows={4} placeholder="请输入客户需求" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCustomerModal;

