# MediFlow Frontend - 客户全周期管理系统前端

## 项目简介

MediFlow 前端是一个基于 React + Vite + Ant Design 构建的现代化医疗客户全周期管理系统，支持 CRM、EMR、HIS 三大业务模块。

## 技术栈

- **React**: 18.2.0
- **Vite**: 4.4.5
- **Ant Design**: 5.10.0
- **React Router**: 6.15.0
- **Axios**: 1.5.0
- **Day.js**: 1.11.9

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 3. 构建生产版本

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod
```

## 项目结构

```
src/
├── components/          # 通用组件
│   └── PrivateRoute.jsx      # 路由守卫
├── config/              # 配置文件
│   └── api.js                # API配置
├── contexts/            # React Context
│   └── AuthContext.jsx       # 认证Context
├── hooks/               # 自定义Hooks
│   └── useMediaQuery.js      # 响应式Hook
├── layouts/             # 布局组件
│   ├── BusinessLayout.jsx    # 商务端布局
│   ├── DoctorLayout.jsx      # 医生端布局
│   ├── NurseLayout.jsx       # 护士端布局
│   └── AdminLayout.jsx       # 管理员布局
├── pages/               # 页面组件
│   ├── Auth/                 # 认证页面
│   │   ├── Login.jsx         # 登录页
│   │   └── Register.jsx      # 注册页
│   └── Admin/                # 管理员页面
│       └── RegistrationReview.jsx  # 注册审核
├── services/            # API服务
│   ├── auth.js              # 认证服务
│   └── admin.js             # 管理员服务
├── utils/               # 工具函数
│   ├── request.js           # Axios封装
│   └── storage.js           # LocalStorage封装
├── App.jsx              # 根组件
├── App.css              # 全局样式
├── main.jsx             # 入口文件
└── index.css            # 基础样式
```

## 核心功能

### 第一阶段 ✅
- [x] 用户登录
- [x] 用户注册申请
- [x] 注册审核（商务管理员）
- [x] 路由守卫和权限控制
- [x] 响应式布局

### 第二阶段（进行中）
- [ ] 客户管理（CRM）
- [ ] 订单管理
- [ ] 跟进记录
- [ ] 预约管理

### 第三阶段（计划中）
- [ ] 电子病历（EMR）
- [ ] 处方管理
- [ ] 医嘱下达

### 第四阶段（计划中）
- [ ] 医嘱执行（HIS）
- [ ] 患者分配
- [ ] 执行记录

### 第五阶段（计划中）
- [ ] 权限配置管理
- [ ] 业绩统计
- [ ] 数据可视化

## 角色与路由

### 角色类型

- **BUSINESS**: 普通商务 - 负责客户开发和跟进
- **BUSINESS_ADMIN**: 商务管理员 - 管理商务团队和审核注册
- **DOCTOR**: 医生 - 负责诊断和开具处方
- **NURSE**: 护士 - 负责执行医嘱和管理患者

### 路由映射

- `/business/*` - 商务端（普通商务/商务管理员）
- `/doctor/*` - 医生端
- `/nurse/*` - 护士端
- `/admin/*` - 管理员端（商务管理员）

## 响应式设计

系统支持多设备访问：

- **桌面端**: 完整功能，侧边栏+主内容布局
- **平板端**: 可收起侧边栏
- **移动端**: 
  - 表格转换为卡片列表
  - 底部导航
  - 优化的触摸交互

断点定义：
- 移动端: ≤ 768px
- 平板端: 769px - 1024px
- 桌面端: ≥ 1025px

## API 接口

前端通过 Axios 与后端 API 通信，基础 URL：`/mediflow/api`

### 认证接口

```
POST /auth/login         # 登录
POST /auth/register      # 注册申请
GET  /auth/current-user  # 获取当前用户
POST /auth/logout        # 登出
```

### 管理员接口

```
GET  /admin/registration-requests         # 获取待审核列表
POST /admin/registration-requests/:id/approve  # 审核通过
POST /admin/registration-requests/:id/reject   # 审核拒绝
```

## 开发规范

### 组件命名

- 使用 PascalCase 命名组件文件：`UserProfile.jsx`
- 使用 camelCase 命名工具函数：`formatDate.js`

### 样式规范

- 每个组件对应一个 CSS 文件
- 使用 BEM 命名规范
- 响应式设计使用媒体查询

### API 调用

```javascript
import { login } from '@/services/auth';

try {
  const result = await login(username, password);
  // 处理成功
} catch (error) {
  // 处理错误
}
```

## 环境变量

创建 `.env` 文件：

```bash
# API基础URL
VITE_API_BASE_URL=/mediflow/api
```

## 部署

### 开发环境

```bash
npm run build:dev
```

### 生产环境

```bash
npm run build:prod
```

构建产物位于 `dist/` 目录，可部署到任何静态文件服务器。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name mediflow.example.com;
    root /var/www/mediflow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /mediflow/api {
        proxy_pass http://localhost:6066;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

Apache License 2.0

## 联系方式

- 项目地址: https://github.com/your-org/mediflow_front
- 问题反馈: https://github.com/your-org/mediflow_front/issues
