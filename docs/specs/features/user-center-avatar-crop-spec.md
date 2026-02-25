---
title: 用户中心页面与头像上传裁切技术规格
status: implemented
created: 2026-02-25
spec_writer: spec-writer
source_plan: docs/plans/2026-02-25-user-center-avatar-crop-plan.md
source_requirement: docs/requirements/2026-02-25-user-center-avatar-crop.md
---

# 用户中心页面与头像上传裁切技术规格

## 1. 概述

本规格定义“用户中心页面 + 头像上传裁切”功能的实现标准，作为实现阶段唯一真理来源。实现目标：

- 为所有已登录用户提供用户中心页面，支持资料展示与编辑。
- 提供“选择图片 -> 校验 -> 裁切 -> 预览 -> 保存”完整闭环。
- 严格执行头像规则：仅 `png`、文件 `<=10MB`、裁切比例固定 `1:1`。
- 保存成功后同步更新页面与全局头像展示。

## 2. 功能需求

### 2.1 P0（必须）

1. 用户中心路由可访问，并接入现有导航入口。
2. 页面加载时调用现有用户资料 API 并回填可编辑字段。
3. 资料编辑后可提交保存，并有成功/失败提示。
4. 支持本地头像文件选择，上传前执行规则校验。
5. 校验通过后进入裁切流程，裁切比例固定 `1:1`。
6. 支持裁切结果预览，预览与最终提交结果一致。
7. 提交保存后端成功后，同步刷新当前页与全局头像。
8. 异常处理必须覆盖：格式错误、大小超限、接口失败、请求超时。

### 2.2 P1（应该）

1. 上传、裁切、保存过程状态明确（loading/success/error）。
2. 失败路径保留重试入口，不强制用户重走全部流程。

### 2.3 P2（可选）

1. 扩展多比例裁切能力（当前版本不实现）。

## 3. 数据模型（字段类型、约束）

### 3.1 UserProfile

```ts
interface UserProfile {
  id: string; // 非空
  nickname: string; // 可编辑，1-32
  email?: string; // 只读或可编辑由后端决定
  phone?: string; // 只读或可编辑由后端决定
  avatarUrl: string; // 非空，头像访问地址
}
```

约束：
- `id`、`nickname`、`avatarUrl` 必填。
- `nickname` 去首尾空格后长度需在允许范围内。

### 3.2 AvatarFileRule

```ts
interface AvatarFileRule {
  acceptedMimeTypes: ['image/png'];
  maxSizeBytes: 10485760; // 10 * 1024 * 1024
  cropAspectRatio: 1; // 1:1
}
```

约束：
- MIME 必须匹配 `image/png`。
- 文件大小必须 `<= 10485760`。
- 裁切比例固定为 `1`，禁止切换。

### 3.3 AvatarCropPayload

```ts
interface AvatarCropPayload {
  blob: Blob; // 由裁切结果生成
  filename: string; // 建议 *.png
  width: number; // > 0
  height: number; // > 0
}
```

约束：
- 导出格式必须为 `png`。
- `width` 与 `height` 必须满足 `width === height`。

### 3.4 UserCenterViewState

```ts
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface UserCenterViewState {
  profileStatus: AsyncStatus;
  saveProfileStatus: AsyncStatus;
  uploadStatus: AsyncStatus;
  cropStatus: AsyncStatus;
  errorMessage: string | null;
}
```

约束：
- 任一状态机进入 `error` 时必须提供可读错误信息。

## 4. API 设计（路径、参数、响应、错误码）

详细契约见 `docs/specs/apis/user-center-avatar-api-contract.md`，此处定义强约束摘要：

1. `GET /user/profile`
   - 用途：获取用户中心初始化数据。
   - success: `200 { code: 0, data: UserProfile }`
   - fail: `401/500`
2. `PUT /user/profile`
   - 用途：保存资料字段（不含文件流）。
   - req: `{ nickname?: string, ... }`
   - success: `200 { code: 0, data: UserProfile }`
   - fail: `400/401/422/500`
3. `POST /user/avatar`
   - 用途：提交裁切后的头像数据。
   - req: `multipart/form-data`（字段 `file`）
   - success: `200 { code: 0, data: { avatarUrl: string } }`
   - fail: `400/401/413/415/422/500`

统一错误结构：

```ts
interface ApiError {
  code: number; // 非 0
  message: string;
  requestId?: string;
}
```

## 5. UI/组件设计

### 5.1 页面与路由

- 用户中心页面：`/user-center`（仅登录可访问）。
- 页面分区：
  - 资料区：展示并编辑个人资料字段。
  - 头像区：当前头像 + 更换头像入口。
  - 操作区：保存按钮、状态提示。

### 5.2 组件拆分（建议）

- `UserCenterView`：页面容器与状态编排。
- `ProfileForm`：资料表单与字段校验。
- `AvatarUploader`：文件选择与前置校验。
- `AvatarCropDialog`：裁切交互（固定 `1:1`）。
- `AvatarPreview`：裁切结果预览。

### 5.3 交互要求

1. 用户点击“更换头像”后打开文件选择，仅接受 `png`。
2. 选择后立即执行格式/大小校验，失败则提示并中断流程。
3. 校验通过后打开裁切弹层，默认展示当前可裁切区域。
4. 用户确认裁切后展示预览，点击保存才会提交后端。
5. 保存中禁用重复提交，成功后页面与全局头像即时更新。

## 6. 边界情况

1. 选择非 `png`：提示“仅支持 PNG 格式”并阻断。
2. 文件超过 `10MB`：提示“图片需小于等于 10MB”并阻断。
3. 用户取消文件选择：保持当前状态，不提示错误。
4. 裁切弹窗关闭未保存：不变更头像。
5. 裁切导出失败：提示失败并允许重试裁切。
6. 保存接口超时/失败：保留预览并提供重试。
7. 登录态过期（401）：触发统一登出流程并跳转登录。

## 7. 安全考虑

1. 前端必须执行文件类型与大小白名单校验，但不替代后端校验。
2. 客户端不信任文件扩展名，优先基于 MIME 判断为 `image/png`。
3. 错误信息展示需脱敏，不回显内部堆栈与敏感上下文。
4. 上传请求必须复用现有认证机制（token/header），禁止匿名上传。

## 8. 测试策略

### 8.1 单元测试

- 文件校验函数：格式通过/失败、大小通过/失败。
- 裁切结果转换函数：输出格式为 `png`，宽高相等。
- 头像保存状态机：loading -> success/error 转换正确。

### 8.2 集成/页面测试

- 用户中心加载资料成功并回填。
- 资料字段编辑并保存成功。
- 头像选择 `png` 且 `<=10MB` 可进入裁切流程。
- 非法文件被阻断并提示。

### 8.3 E2E（关键路径）

- 场景 1：进入用户中心 -> 选择合法头像 -> 裁切 -> 预览 -> 保存成功。
- 场景 2：选择非 `png` -> 立即提示并无法继续。
- 场景 3：选择超限文件 -> 立即提示并无法继续。
- 场景 4：保存接口失败 -> 显示错误并可重试。

### 8.4 门禁命令

- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 9. 验收清单

- [ ] `/user-center` 对登录用户可访问，未登录不可访问。
- [ ] 资料加载与保存功能可用，成功/失败提示清晰。
- [ ] 头像仅允许 `png`，且大小 `<=10MB`。
- [ ] 裁切比例固定 `1:1`，不可切换。
- [ ] 保存成功后当前页与全局头像均同步更新。
- [ ] 格式错误、大小超限、接口失败、超时均有可验证处理。
- [ ] `lint/test/build` 全通过。

## 10. 实施文件清单（强约束）

以下文件在实现阶段必须存在（可在不破坏职责前提下扩展）：

- `src/views/user-center/UserCenterView.vue`
- `src/components/user-center/ProfileForm.vue`
- `src/components/user-center/AvatarUploader.vue`
- `src/components/user-center/AvatarCropDialog.vue`
- `src/components/user-center/AvatarPreview.vue`
- `src/api/user.ts`
- `src/stores/user.ts`
- `src/router/index.ts`（新增路由）
- `tests/unit/user-center/*.spec.ts`
- `tests/e2e/user-center-avatar.spec.ts`

## 11. 变更历史

| 版本 | 日期 | 变更内容 | 状态 |
|------|------|----------|------|
| 1.0 | 2026-02-25 | 初始规格定义（基于 approved 计划） | approved |
| 1.1 | 2026-02-25 | 实现完成：用户中心页面、头像上传裁切、测试与验收命令通过 | implemented |
