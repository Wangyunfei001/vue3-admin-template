---
title: Vue3 全家桶中后台模板技术规格
status: implemented
created: 2026-02-24
spec_writer: spec-writer
source_architecture: docs/architecture/vue3-template-architecture.md
---

# Vue3 全家桶中后台模板技术规格

## 1. 概述

本规格定义一个可复用的 Vue3 中后台模板实现标准，作为代码实现阶段的唯一真理来源。实现目标：

- `pnpm install && pnpm dev` 一次启动成功。
- 提供登录页、首页、权限路由示例。
- 支持 i18n、暗黑模式、主题、响应式布局。
- 具备 mock、单测、端测、CI、Docker、README。

## 2. 功能需求

### 2.1 P0（必须）

1. 基础工程：Vue3 + Vite + TypeScript + Pinia + Vue Router。
2. 请求层：axios 统一封装（请求拦截、响应拦截、错误归一化）。
3. 权限：登录态校验 + 路由权限校验（公开/受保护路由）。
4. 国际化：zh-CN / en-US 切换。
5. 主题：light/dark/system，支持持久化。
6. 样式：Tailwind CSS + CSS Variables。
7. Mock：auth 与 menu 相关接口。
8. 测试：Vitest 与 Playwright 可执行。
9. 工程门禁：lint/test/build 全通过。
10. 文档：README + 目录规范说明。

### 2.2 P1（应该）

1. CI 流水线（install/lint/test/e2e/build）。
2. Docker 多阶段构建与运行说明。
3. 401/403/404 异常页。

### 2.3 P2（可选）

1. 按钮级权限示例。
2. 多主题色动态切换策略扩展。

## 3. 数据模型（字段类型、约束）

### 3.1 AuthUser

```ts
interface AuthUser {
  id: string; // 非空
  name: string; // 非空
  roles: string[]; // 至少 1 个角色
  permissions: string[]; // 可空数组
}
```

约束：
- `id`、`name` 必填。
- `roles` 必须存在，元素为非空字符串。

### 3.2 AuthState

```ts
interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}
```

约束：
- `isAuthenticated === true` 时，`token` 必须非空。

### 3.3 ThemeState

```ts
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  primaryColor: string; // CSS color value
}
```

约束：
- `mode` 仅允许三种枚举值。

### 3.4 AppState

```ts
type Locale = 'zh-CN' | 'en-US';

interface AppState {
  locale: Locale;
  sidebarCollapsed: boolean;
}
```

约束：
- `locale` 仅允许 `zh-CN` 或 `en-US`。

## 4. API 设计（路径、参数、响应、错误码）

详细契约见 `docs/specs/apis/vue3-template-api-contract.md`，此处定义强约束摘要：

1. `POST /api/auth/login`
   - req: `{ username: string; password: string }`
   - success: `200 { code: 0, data: { token: string, expiresIn: number } }`
   - fail: `400/401`
2. `GET /api/auth/me`
   - headers: `Authorization: Bearer <token>`
   - success: `200 { code: 0, data: AuthUser }`
   - fail: `401`
3. `GET /api/navigation/menus`
   - success: `200 { code: 0, data: MenuItem[] }`
   - fail: `401/403`
4. `POST /api/auth/logout`
   - success: `200 { code: 0, data: { success: true } }`

统一错误响应：

```ts
interface ApiError {
  code: number; // 非 0
  message: string;
  requestId?: string;
}
```

## 5. UI/组件设计

### 5.1 页面清单

- 登录页：`/login`
- 首页：`/`
- 403 页：`/403`
- 404 页：`/:pathMatch(.*)*`

### 5.2 布局要求

- 桌面端：侧栏 + 顶栏 + 主内容区。
- 移动端：侧栏转抽屉，默认收起。
- 登录页：居中卡片布局，窄屏宽度自适配。

### 5.3 关键组件

- `AppLayout`：全局主布局。
- `AppSidebar`：菜单与折叠控制。
- `ThemeSwitch`：主题切换。
- `LocaleSwitch`：语言切换。
- `AuthGuard`（逻辑层）：路由守卫封装。

## 6. 边界情况

1. token 丢失/过期：任意受保护路由访问时强制跳转 `/login`。
2. 权限不足：跳转 `/403`，保留来源路由用于提示。
3. mock 服务异常：页面展示统一错误提示，不出现白屏。
4. locale 缺失：回退到 `zh-CN`。
5. localStorage 不可用：功能降级到内存态，并输出警告日志。
6. 移动端极窄宽度：允许滚动，不出现主要交互不可点击。

## 7. 安全考虑

1. token 存储在 `localStorage`（模板场景），需在 README 明确生产建议（可切 HttpOnly Cookie）。
2. axios 请求头统一注入 token，禁止在 URL 透传敏感信息。
3. 错误信息展示需脱敏，不输出堆栈到用户 UI。
4. mock 数据仅限开发环境启用，生产构建禁用 mock。

## 8. 测试策略

### 8.1 单元测试（Vitest）

- `authStore`：登录成功、退出、token 恢复。
- `themeStore`：mode 切换与持久化。
- `route guard`：未登录拦截、权限不足拦截。
- `http client`：401 处理与错误归一化。

### 8.2 端到端测试（Playwright）

- 场景 1：登录成功 -> 进入首页 -> 显示用户信息。
- 场景 2：未登录访问受保护路由 -> 跳转登录。
- 场景 3：切换语言 -> 关键文案更新。
- 场景 4：切换暗黑模式 -> 根节点 class 变化。

### 8.3 门禁命令

- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`

所有命令必须在 CI 中同样通过。

## 9. 验收清单

- [ ] Node 20 LTS + pnpm 环境下安装与启动成功。
- [ ] 登录页、首页、权限路由示例可用。
- [ ] i18n（中英文）切换有效。
- [ ] 暗黑模式与主题切换有效。
- [ ] mock 接口可驱动主流程。
- [ ] 响应式布局在桌面与移动宽度可用。
- [ ] lint/test/test:e2e/build 全通过。
- [ ] CI 流水线可执行并通过。
- [ ] Docker 镜像可构建并启动静态站点。
- [ ] README 与目录规范文档完整。

## 10. 实施文件清单（强约束）

以下文件在实现阶段必须存在（允许按约定扩展）：

- `src/main.ts`
- `src/router/index.ts`
- `src/router/guards.ts`
- `src/stores/auth.ts`
- `src/stores/theme.ts`
- `src/stores/app.ts`
- `src/lib/http/client.ts`
- `src/api/auth.ts`
- `src/i18n/index.ts`
- `src/views/login/LoginView.vue`
- `src/views/home/HomeView.vue`
- `src/views/error/ForbiddenView.vue`
- `src/views/error/NotFoundView.vue`
- `mock/auth.ts`
- `tests/unit/*.spec.ts`
- `tests/e2e/*.spec.ts`
- `.github/workflows/ci.yml`
- `Dockerfile`
- `README.md`

## 11. 变更历史

| 版本 | 日期 | 变更内容 | 状态 |
|------|------|----------|------|
| 1.1 | 2026-02-24 | 落地实现并完成回归验证；补充 401 防重入、本地会话清理、路由守卫失败兜底、菜单加载异常降级 | implemented |
| 1.0 | 2026-02-24 | 初始规格定义 | approved |
