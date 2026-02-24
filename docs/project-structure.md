# 目录规范

## 根目录

- `src/`：应用源码
- `mock/`：开发态 mock 接口
- `tests/unit/`：单元测试
- `tests/e2e/`：端到端测试
- `docs/`：需求、计划、架构、规格与项目文档
- `.github/workflows/`：CI 配置

## `src/` 约定

- `app/`：启动与环境初始化逻辑
- `router/`：路由与守卫
- `stores/`：Pinia 状态管理
- `lib/http/`：axios 客户端与错误归一化
- `api/`：接口层（调用 `lib/http`）
- `i18n/`：国际化资源
- `layouts/`：页面布局
- `views/`：页面级组件
- `components/`：可复用组件
- `styles/`：全局样式与主题变量
- `types/`：共享类型

## 开发约束

1. 业务请求仅通过 `src/api` 暴露，不在页面中直接调用 axios。
2. 权限逻辑统一放在路由守卫与权限 store。
3. i18n 文案统一维护在 `src/i18n/locales`。
4. 新增页面需补充对应测试（至少 unit 或 e2e 之一）。
