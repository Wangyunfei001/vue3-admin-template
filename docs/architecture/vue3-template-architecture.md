---
title: Vue3 全家桶模板架构方案
status: approved
created: 2026-02-24
architect: architect
source_plan: docs/plans/2026-02-24-vue3-template-architecture-plan.md
---

# Vue3 全家桶模板架构方案

## 1. 目标与范围

本方案用于指导“个人可复用的通用中后台模板”落地，覆盖：

- 前端基础架构（Vue3 + Vite + TypeScript + Pinia + Vue Router）。
- 请求层、权限、i18n、主题/暗黑、Tailwind 响应式。
- Mock、测试、CI/CD、Docker、文档交付。

明确不包含：

- 真实后端对接。
- SSR（Nuxt）。
- 微前端。

## 2. 架构总览

### 2.1 分层设计

- **应用层（App）**：入口初始化、全局插件注册、路由守卫挂载。
- **展示层（Views/Components）**：页面与复用组件。
- **领域状态层（Stores）**：用户态、权限态、主题态、国际化态。
- **基础设施层（Infra）**：axios 封装、mock、路由、i18n、日志与错误处理。
- **工程保障层（Quality）**：lint、unit、e2e、CI、Docker。

### 2.2 核心流程

- 启动流程：`main.ts -> 注册 Pinia/Router/i18n -> 挂载 App -> 启动 mock（dev）`。
- 登录流程：登录页提交 -> axios 调用 mock 登录接口 -> 写入 token/store -> 跳转首页。
- 权限流程：路由切换 -> guard 校验 token/角色 -> 放行或重定向登录/403。
- 主题流程：主题 store 切换 -> 应用 CSS 变量 + `dark` class -> 本地持久化。

## 3. 目录与模块设计

建议目录（核心）：

- `src/app`：应用初始化（插件、provider、guard）。
- `src/router`：路由表、动态路由、守卫。
- `src/stores`：Pinia 状态管理。
- `src/api`：业务 API 声明（基于 axios client）。
- `src/lib/http`：axios 实例、拦截器、错误归一化。
- `src/i18n`：语言资源与切换逻辑。
- `src/layouts`：主布局与响应式框架。
- `src/views`：登录页、首页、异常页等。
- `src/components`：基础复用组件。
- `src/styles`：Tailwind 入口、主题 token、全局样式。
- `src/types`：全局类型定义。
- `mock`：接口模拟与数据。
- `tests/unit`、`tests/e2e`：测试代码。

## 4. 技术选型与关键决策

- 构建：`Vite`（启动快、生态成熟）。
- 语言：`TypeScript`（严格模式）。
- 状态：`Pinia`（Vue3 官方推荐生态）。
- 路由：`Vue Router`（组合式与守卫能力完整）。
- 请求层：`axios`（拦截器与统一错误处理更直接）。
- 样式：`Tailwind CSS`（原子化与快速搭建）。
- 国际化：`vue-i18n`。
- 单测：`Vitest + Vue Test Utils`。
- E2E：`Playwright`。
- Mock：开发态 mock 中间层（按接口模块化组织）。
- CI：GitHub Actions（可替换同类平台）。
- 容器：Docker 多阶段构建（build + runtime）。

## 5. 数据模型与状态模型

### 5.1 前端状态模型（新增）

- `authStore`
  - `token: string | null`
  - `user: { id: string; name: string; roles: string[] } | null`
  - `isAuthenticated: boolean`
- `permissionStore`
  - `routes: RouteRecordRaw[]`
  - `permissions: string[]`
- `themeStore`
  - `mode: 'light' | 'dark' | 'system'`
  - `primaryColor: string`
- `appStore`
  - `locale: 'zh-CN' | 'en-US'`
  - `sidebarCollapsed: boolean`

### 5.2 持久化策略

- `token`、`locale`、`theme` 使用 `localStorage` 持久化。
- 用户资料与权限信息可在刷新后按 token 重新拉取（mock 场景下可本地恢复）。

## 6. API 与 Mock 设计

### 6.1 API 约定（模板级）

- `POST /api/auth/login`
  - req: `{ username, password }`
  - res: `{ token, expiresIn }`
- `GET /api/auth/me`
  - res: `{ id, name, roles, permissions }`
- `GET /api/navigation/menus`
  - res: `MenuItem[]`
- `POST /api/auth/logout`
  - res: `{ success: true }`

### 6.2 错误码与处理

- 401：未登录或 token 失效 -> 清理登录态并跳转登录。
- 403：已登录但无权限 -> 跳转 403 页面。
- 5xx：统一 toast 提示 + 错误日志记录。

## 7. 权限与路由策略

- 路由元信息：`meta.requiresAuth`、`meta.roles`、`meta.permissions`。
- 守卫规则：
  - 公共路由直接放行。
  - 受保护路由需登录态。
  - 角色/权限不匹配时重定向 403。
- 首版以静态路由 + 元信息校验为主，预留动态路由扩展点。

## 8. 主题、样式与多端适配

- 主题方案：`CSS Variables + Tailwind` 联合驱动。
- 暗黑模式：通过根节点 `class="dark"` 与 token 切换。
- 响应式策略：
  - 断点：`sm/md/lg/xl`（Tailwind 默认可扩展）。
  - 桌面端侧栏固定，移动端侧栏抽屉化。
  - 登录页与首页关键区域保证在常见手机宽度可用。

## 9. 测试与质量门禁

- 单测覆盖对象：store、route guard、http 错误归一化、核心 util。
- E2E 核心路径：登录 -> 首页 -> 权限页访问 -> 退出。
- 门禁标准：
  - `pnpm lint` 通过。
  - `pnpm test` 通过。
  - `pnpm test:e2e` 通过。
  - `pnpm build` 通过。

## 10. 交付与运行架构

- CI 流水线阶段：install -> lint -> unit -> e2e -> build。
- Docker：
  - build 阶段使用 Node 20 LTS 镜像。
  - runtime 阶段使用轻量 Web Server 镜像托管静态产物。

## 11. 对现有架构影响评估

当前仓库为新建模板项目，影响为“新增”为主：

- 无历史业务兼容压力。
- 可一次性落地统一目录规范与质量规范。
- 后续扩展风险主要来自依赖升级与功能膨胀，需要通过 ADR + CI 管控。

## 12. 实施建议（与计划映射）

- 第一批实现：T01-T11（完成可运行主链路）。
- 第二批实现：T12-T17（完善功能与测试闭环）。
- 第三批实现：T18-T21（工程化、文档化、总体验收）。

## 13. Gate 3 检查清单

- [ ] 架构方案覆盖核心模块与关键流程。
- [ ] 数据模型与 API 约定可支撑 P0 需求。
- [ ] 技术选型与依赖版本边界清晰。
- [ ] 风险与演进方向可执行。
- [ ] ADR 已同步并可追溯。

