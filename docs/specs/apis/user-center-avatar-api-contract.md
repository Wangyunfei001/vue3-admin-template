---
title: 用户中心与头像 API 契约规格
status: implemented
created: 2026-02-25
spec_writer: spec-writer
source_feature_spec: docs/specs/features/user-center-avatar-crop-spec.md
---

# 用户中心与头像 API 契约规格

## 1. 通用约定

### 1.1 Base URL

- 开发环境：`/api`
- 生产环境：由网关/反向代理配置

### 1.2 Header

- `Authorization: Bearer <token>`（必填）
- `Content-Type: application/json`（资料接口）
- `Content-Type: multipart/form-data`（头像上传接口）

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
- `41301` 文件超过大小限制（413）
- `41501` 文件类型不支持（415）
- `42201` 业务校验失败（422）
- `50000` 服务异常（500）

## 2. GET /user/profile

### 2.1 用途

获取当前登录用户资料，用于用户中心页面初始化。

### 2.2 请求

- body: 无
- query: 无

### 2.3 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "u_1001",
    "nickname": "Tom",
    "email": "tom@example.com",
    "phone": "13800000000",
    "avatarUrl": "https://cdn.example.com/avatar/u_1001.png"
  }
}
```

### 2.4 失败响应

- `401`：token 缺失/过期/无效
- `500`：服务异常

## 3. PUT /user/profile

### 3.1 用途

保存用户可编辑资料字段。

### 3.2 请求

```json
{
  "nickname": "Tom New"
}
```

请求约束：
- `nickname`：可选，去首尾空格后长度 1-32。
- 其余字段是否允许编辑，以现有后端契约为准。

### 3.3 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "u_1001",
    "nickname": "Tom New",
    "email": "tom@example.com",
    "phone": "13800000000",
    "avatarUrl": "https://cdn.example.com/avatar/u_1001.png"
  }
}
```

### 3.4 失败响应

- `400`：参数格式错误
- `401`：未登录
- `422`：业务规则不满足
- `500`：服务异常

## 4. POST /user/avatar

### 4.1 用途

上传裁切后的头像文件并返回最新头像地址。

### 4.2 请求

`multipart/form-data` 字段：

- `file`: 文件流（必填）

请求约束（强约束）：
- 文件 MIME 必须为 `image/png`
- 文件大小必须 `<=10MB`
- 文件内容需来自 `1:1` 裁切结果（后端可二次校验宽高一致性）

### 4.3 成功响应（200）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "avatarUrl": "https://cdn.example.com/avatar/u_1001_v2.png"
  }
}
```

### 4.4 失败响应

- `400`：缺少文件字段或参数错误
- `401`：未登录
- `413`：文件超过 10MB
- `415`：文件类型非 png
- `422`：业务校验失败（例如宽高不符合）
- `500`：服务异常

## 5. 类型定义（实现必须对齐）

```ts
export interface UserProfile {
  id: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatarUrl: string;
}

export interface UpdateUserProfileRequest {
  nickname?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
```

## 6. 客户端错误处理规范

1. `401`：触发统一会话失效处理并跳转登录。
2. `413`：提示“图片需小于等于 10MB”。
3. `415`：提示“仅支持 PNG 格式图片”。
4. `422`：展示后端业务错误文案，保留当前可重试状态。
5. `500`：提示“服务繁忙，请稍后重试”。

## 7. Mock 规则

1. 开发环境提供 `GET /user/profile`、`PUT /user/profile`、`POST /user/avatar` mock。
2. 可通过开关注入 `401/413/415/500` 错误，覆盖异常流程测试。
3. mock 响应必须遵循统一结构，不返回裸对象。

## 8. API 级测试断言

1. `GET /user/profile` 在有效 token 下返回 `code=0`。
2. `PUT /user/profile` 提交合法昵称后回包字段更新。
3. `POST /user/avatar` 提交合法 png（<=10MB）返回新 `avatarUrl`。
4. `POST /user/avatar` 提交非 png 返回 `415`。
5. `POST /user/avatar` 提交超限文件返回 `413`。

## 9. 变更历史

| 版本 | 日期 | 变更内容 | 状态 |
|------|------|----------|------|
| 1.0 | 2026-02-25 | 初始 API 契约定义 | approved |
| 1.1 | 2026-02-25 | 实现完成：客户端 API、Mock 契约、错误处理映射已对齐 | implemented |
