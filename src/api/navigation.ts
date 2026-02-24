import { httpClient, request } from '@/lib/http/client'
import type { MenuItem } from '@/types/navigation'

export function fetchMenus(locale?: 'zh-CN' | 'en-US') {
  return request<MenuItem[]>(httpClient.get('/navigation/menus', { params: { locale } }))
}
