import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Input, message, Card, Space } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getRegistrationRequests, approveRequest, rejectRequest } from '../../services/admin';
import { ROLE_MAP } from '../../config/api';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './RegistrationReview.css';

const { TextArea } = Input;

const RegistrationReview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const { isMobile } = useMediaQuery();

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getRegistrationRequests();
      setData(result || []);
    } catch (error) {
      message.error('加载失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 审核通过
  const handleApprove = async (id) => {
    Modal.confirm({
      title: '确认通过审核？',
      content: '通过后该用户将可以登录系统',
      onOk: async () => {
        try {
          await approveRequest(id);
          message.success('审核通过！');
          loadData();
        } catch (error) {
          message.error('操作失败：' + error.message);
        }
      },
    });
  };

  // 显示拒绝弹窗
  const showRejectModal = (record) => {
    setSelectedRequest(record);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  // 审核拒绝
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请填写拒绝理由');
      return;
    }

    try {
      await rejectRequest(selectedRequest.id, rejectReason);
      message.success('已拒绝申请');
      setRejectModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败：' + error.message);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '申请角色',
      dataIndex: 'appliedRole',
      key: 'appliedRole',
      width: 120,
      render: (role) => <Tag color="blue">{ROLE_MAP[role] || role}</Tag>,
    },
    {
      title: '申请理由',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: isMobile ? undefined : 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            通过
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => showRejectModal(record)}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="registration-review">
      <Card
        title="注册审核"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
          >
            刷新
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: isMobile ? 800 : undefined }}
          locale={{
            emptyText: '暂无待审核的申请',
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 拒绝弹窗 */}
      <Modal
        title="拒绝申请"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="确认拒绝"
        cancelText="取消"
      >
        <p>
          申请人：<strong>{selectedRequest?.realName}</strong> ({selectedRequest?.username})
        </p>
        <p>
          申请角色：
          <Tag color="blue">{ROLE_MAP[selectedRequest?.appliedRole]}</Tag>
        </p>
        <div style={{ marginTop: 16 }}>
          <p>拒绝理由：</p>
          <TextArea
            rows={4}
            placeholder="请填写拒绝理由"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RegistrationReview;

