---
title: Vue3 模板 API 契约规格
status: implemented
created: 2026-02-24
spec_writer: spec-writer
source_feature_spec: docs/specs/features/vue3-template-spec.md
---

# Vue3 模板 API 契约规格

## 1. 通用约定

### 1.1 Base URL

- 开发环境：`/api`
- 生产环境：由部署层反向代理配置

### 1.2 Header

- `Content-Type: application/json`
- `Authorization: Bearer <token>`（仅受保护接口）

### 1.3 统一响应结构

```ts
interface ApiSuccess<T> {
  code: 0;
  message: 'ok';
  data: T;
}

interface ApiFail {
  code: number; // 非 0
  message: string;
  requestId?: string;
}
```

### 1.4 错误码定义

- `40001` 参数错误（400）
- `40101` 未登录或 token 无效（401）
- `40301` 权限不足（403）
- `50000` 服务异常（500）

## 2. POST /auth/login

### 2.1 请求

```json
{
  "username": "admin",
  "password": "123456"
}
```

约束：
- `username`: 必填，长度 3-32。
- `password`: 必填，长度 6-64。

### 2.2 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "mock-jwt-token",
    "expiresIn": 7200
  }
}
```

### 2.3 失败响应

- 400 参数校验失败
- 401 账号密码错误

## 3. GET /auth/me

### 3.1 请求

- 必须携带 `Authorization`

### 3.2 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "u_1001",
    "name": "Admin User",
    "roles": ["admin"],
    "permissions": ["dashboard:view", "user:list"]
  }
}
```

### 3.3 失败响应

- 401 token 缺失/过期/无效

## 4. GET /navigation/menus

### 4.1 请求

- 可选 query：`locale=zh-CN|en-US`

### 4.2 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "dashboard",
      "title": "仪表盘",
      "path": "/",
      "icon": "home",
      "children": []
    }
  ]
}
```

### 4.3 失败响应

- 401 未登录
- 403 无菜单访问权限

## 5. POST /auth/logout

### 5.1 请求

- 无 body，允许空对象

### 5.2 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "success": true
  }
}
```

## 6. 类型定义（实现必须对齐）

```ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface MeResponse {
  id: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}
```

## 7. Mock 规则

1. mock 仅在开发模式启用。
2. 每个接口可注入 `100-400ms` 延迟，用于模拟真实网络。
3. 支持通过环境变量触发错误注入（401/403/500）以便 E2E 覆盖异常场景。
4. 所有 mock 响应遵循统一响应结构，不允许返回裸对象。

## 8. 测试断言（API 级）

1. 登录成功返回 `code=0` 且 `token` 非空。
2. 未携带 token 调用 `/auth/me` 返回 401。
3. 权限不足访问 `/navigation/menus` 返回 403。
4. 所有失败响应包含非空 `message`。

## 9. 实现对齐说明

1. 401 响应在客户端统一触发本地会话清理与跳转登录，且采用防重入策略避免并发 401 引发重复跳转。
2. 业务层请求新增 `code !== 0` 校验，HTTP 200 且业务失败时会抛出标准化错误。
3. `/auth/logout` 在主动退出路径调用；401 被动失效路径仅做本地清理，不再重复请求登出接口。

## 10. 变更历史

| 版本 | 日期 | 变更内容 | 状态 |
|------|------|----------|------|
| 1.1 | 2026-02-24 | 同步客户端实现策略（401 防重入、业务码校验、被动登出语义） | implemented |
| 1.0 | 2026-02-24 | 初始 API 契约定义 | approved |
