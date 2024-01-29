import { createUniFetch } from 'uni-app-fetch'
import { useUserStore } from '@/stores/user'

// 定义 tabBar 的路径
const tabBarPagePaths = [
  'pages/task/index',
  'pages/message/index',
  'pages/my/index',
]

export const uniFetch = createUniFetch({
  loading: { title: '正在加载...' },
  baseURL: 'https://slwl-api.itheima.net',
  intercept: {
    // 请求拦截器
    request(options) {
      const userStore = useUserStore()
      // 这样后续增加 header 方便扩展
      const defaultHeaders = {
        Authorization: userStore.token,
      }
      options.header = {
        ...defaultHeaders,
        ...options.header,
      }
      // 后续补充实际逻辑
      return options
    },
    // 响应拦截器
    response({ data, statusCode }) {
      if (statusCode === 401) {
        // token 失效
        const pageStack = getCurrentPages()
        const redirectUrl = pageStack[pageStack.length - 1].route
        // tabBar 页面需要使用 switchTab 跳转
        const routeType = tabBarPagePaths.includes(redirectUrl)
          ? 'switchTab'
          : 'redirectTo'
        // 跳转页面
        return uni.redirectTo({
          url: `/pages/login/index?redirectUrl=/${redirectUrl}&routeType=${routeType}`,
        })
      }
      const code = data.code
      if (code === 200) {
        return data
      } else {
        uni.utils.toast(data.msg || '业务错误')
        return Promise.reject(data)
      }
    },
  },
})
