import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Empty, Spin, message, Popconfirm, DatePicker, Space, Tabs } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getAppointments, cancelAppointment, completeAppointment } from '../../services/appointment';
import dayjs from 'dayjs';
import './AppointmentManagement.css';

const { TabPane } = Tabs;

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('today'); // today, all, pending, completed

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (filter === 'today') {
        params.date = dayjs().format('YYYY-MM-DD');
        params.status = 'SCHEDULED';
      } else if (filter === 'pending') {
        params.status = 'SCHEDULED';
      } else if (filter === 'completed') {
        params.status = 'COMPLETED';
      }
      
      const response = await getAppointments(params);
      if (response && response.success) {
        // 按预约时间排序
        const sortedAppointments = (response.data || []).sort((a, b) => {
          return new Date(a.appointmentTime) - new Date(b.appointmentTime);
        });
        setAppointments(sortedAppointments);
      } else {
        message.error('获取预约列表失败');
      }
    } catch (error) {
      console.error('获取预约列表失败:', error);
      message.error('获取预约列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone).then(() => message.success('手机号已复制'));
      } else {
        const input = document.createElement('input');
        input.value = phone;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        message.success('手机号已复制');
      }
    } catch (e) {
      console.error(e);
      message.error('复制失败');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await completeAppointment(id);
      if (response && response.success) {
        message.success('预约已完成');
        fetchAppointments();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('完成预约失败:', error);
      message.error('操作失败');
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await cancelAppointment(id);
      if (response && response.success) {
        message.success('预约已取消');
        fetchAppointments();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      console.error('取消预约失败:', error);
      message.error('操作失败');
    }
  };

  const renderAppointmentCard = (appointment) => {
    const isCompleted = appointment.appointmentStatus === 'COMPLETED';
    const isCancelled = appointment.appointmentStatus === 'CANCELLED';
    const isScheduled = appointment.appointmentStatus === 'SCHEDULED';
    const isPast = appointment.appointmentTime && dayjs(appointment.appointmentTime).isBefore(dayjs());

    return (
      <Card
        key={appointment.id}
        style={{
          marginBottom: '16px',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: isCompleted ? '4px solid #52c41a' : isCancelled ? '4px solid #faad14' : '4px solid #1890ff',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: '16px' } }}
      >
        {/* 顶部：客户信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            <Tag color={isCompleted ? 'success' : isCancelled ? 'default' : 'processing'}>
              {isCompleted ? '已完成' : isCancelled ? '已取消' : '待完成'}
            </Tag>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>
              {appointment.customerName || '未命名客户'}
            </span>
            {isPast && isScheduled && (
              <Tag color="red" style={{ margin: 0 }}>已逾期</Tag>
            )}
          </div>
          {/* 联系方式 */}
          {appointment.customerPhone && (
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', flexShrink: 0 }}>
              <PhoneOutlined style={{ marginRight: '4px', fontSize: '13px' }} />
              <a 
                href={`tel:${appointment.customerPhone}`}
                style={{ 
                  fontSize: '13px', 
                  fontFamily: 'Menlo, Monaco, Consolas, monospace',
                  color: '#1890ff',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointment.customerPhone}
              </a>
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => handleCopyPhone(appointment.customerPhone)}
                style={{ marginLeft: '4px', padding: '0 4px' }}
              />
            </div>
          )}
        </div>

        {/* 预约时间信息框 */}
        <div style={{ 
          marginBottom: '8px',
          padding: '8px',
          backgroundColor: isCancelled ? '#f5f5f5' : (isCompleted ? '#f6ffed' : '#f0f5ff'),
          borderRadius: '4px',
          border: isCancelled ? '1px solid #d9d9d9' : (isCompleted ? '1px solid #95de64' : '1px solid #91caff')
        }}>
          {/* 预约时间 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            <CalendarOutlined style={{ 
              color: isCancelled ? '#999' : (isCompleted ? '#52c41a' : '#1890ff'), 
              fontSize: '14px', 
              flexShrink: 0 
            }} />
            <span style={{ fontSize: '13px', color: '#666', flexShrink: 0 }}>
              预约时间
            </span>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: isCancelled ? '#999' : (isCompleted ? '#52c41a' : '#1890ff'),
              textDecoration: isCancelled ? 'line-through' : 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}>
              {dayjs(appointment.appointmentTime).format('YYYY-MM-DD HH:mm')}
              {' '}
              {(() => {
                const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                return weekdays[dayjs(appointment.appointmentTime).day()];
              })()}
            </span>
          </div>

          {/* 到院目的 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '6px',
            marginBottom: '8px',
            fontSize: '13px', 
            color: '#666'
          }}>
            <UserOutlined style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 'bold' }}>到院目的：</span>
              <span>{appointment.appointmentPurpose || '未填写'}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          {isScheduled && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              gap: '8px'
            }}>
              <Popconfirm
                title="确定取消预约？"
                onConfirm={() => handleCancel(appointment.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  danger
                  size="small"
                  icon={<CloseCircleOutlined />}
                >
                  取消
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定标记为已完成？"
                onConfirm={() => handleComplete(appointment.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  size="small"
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                >
                  完成
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>

        {/* 备注信息 */}
        {appointment.notes && (
          <div style={{ 
            fontSize: '12px', 
            color: '#999',
            marginTop: '8px'
          }}>
            备注：{appointment.notes}
          </div>
        )}

        {/* 创建信息 */}
        {appointment.createdAt && (
          <div style={{ 
            fontSize: '12px', 
            color: '#999',
            marginTop: '4px'
          }}>
            创建于 {dayjs(appointment.createdAt).format('YYYY-MM-DD HH:mm')}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="appointment-management">
      <Card
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Tabs activeKey={filter} onChange={setFilter}>
          <TabPane tab="今日待办" key="today">
            <Spin spinning={loading}>
              {appointments.length === 0 ? (
                <Empty description="今日暂无预约" />
              ) : (
                appointments.map(renderAppointmentCard)
              )}
            </Spin>
          </TabPane>
          
          <TabPane tab="所有待办" key="pending">
            <Spin spinning={loading}>
              {appointments.length === 0 ? (
                <Empty description="暂无待完成的预约" />
              ) : (
                appointments.map(renderAppointmentCard)
              )}
            </Spin>
          </TabPane>
          
          <TabPane tab="已完成" key="completed">
            <Spin spinning={loading}>
              {appointments.length === 0 ? (
                <Empty description="暂无已完成的预约" />
              ) : (
                appointments.map(renderAppointmentCard)
              )}
            </Spin>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
