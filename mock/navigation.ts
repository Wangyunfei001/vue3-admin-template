import type MockAdapter from 'axios-mock-adapter'

const menus = {
  'zh-CN': [
    { id: 'dashboard', title: '首页', path: '/' },
    { id: 'user-center', title: '用户中心', path: '/user-center' },
    { id: 'forbidden', title: '无权限', path: '/forbidden-demo' },
  ],
  'en-US': [
    { id: 'dashboard', title: 'Home', path: '/' },
    { id: 'user-center', title: 'User Center', path: '/user-center' },
    { id: 'forbidden', title: 'Forbidden', path: '/forbidden-demo' },
  ],
}

export function registerNavigationMocks(mock: MockAdapter) {
  mock.onGet('/navigation/menus').reply((config) => {
    if (!config.headers?.Authorization) {
      return [401, { code: 40101, message: 'Unauthorized' }]
    }
    const locale = (config.params?.locale as 'zh-CN' | 'en-US' | undefined) || 'zh-CN'
    return [200, { code: 0, message: 'ok', data: menus[locale] ?? menus['zh-CN'] }]
  })
}
