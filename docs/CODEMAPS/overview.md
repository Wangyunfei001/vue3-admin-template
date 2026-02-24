# CODEMAP Overview

## 项目结构（实现态）

```text
src/
├── app/
│   ├── bootstrap.ts
│   └── mock.ts
├── api/
│   ├── auth.ts
│   └── navigation.ts
├── components/
│   ├── LocaleSwitch.vue
│   └── ThemeSwitch.vue
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en-US.ts
│       └── zh-CN.ts
├── layouts/
│   └── AppLayout.vue
├── lib/
│   └── http/
│       └── client.ts
├── router/
│   ├── guards.ts
│   ├── index.ts
│   ├── route-meta.d.ts
│   ├── routes.ts
│   └── types.ts
├── stores/
│   ├── app.ts
│   ├── auth.ts
│   ├── permission.ts
│   └── theme.ts
├── styles/
│   └── main.css
├── types/
│   ├── api.ts
│   ├── auth.ts
│   └── navigation.ts
├── views/
│   ├── error/
│   │   ├── ForbiddenView.vue
│   │   └── NotFoundView.vue
│   ├── home/
│   │   └── HomeView.vue
│   └── login/
│       └── LoginView.vue
├── App.vue
└── main.ts
```

## 关键模块映射

- 鉴权与会话：`src/stores/auth.ts` + `src/lib/http/client.ts` + `src/router/guards.ts`
- API 访问层：`src/api/*`（统一经 `src/lib/http/client.ts`）
- Mock：`mock/auth.ts`、`mock/navigation.ts`（由 `src/app/mock.ts` 注入）
- 主题与国际化：`src/stores/theme.ts`、`src/i18n/*`、`src/components/*Switch.vue`
- 质量保障：`tests/unit/*`、`tests/e2e/*`、`.github/workflows/ci.yml`

## 同步时间

- 2026-02-24：由 `/sync` 生成并与当前实现对齐。
