import { uniFetch } from './uni-fetch.js'

/**
 * 用户登录
 */
export const loginApi = (data) => {
  if (!data.account || !data.password) return
  return uniFetch.post('/driver/login/account', data)
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return uniFetch.get('/driver/users')
}

/**
 * 获取车辆信息
 */
export const getUserTruckApi = () => {
  return uniFetch.get('/driver/users/truck')
}

/**
 * 任务数据
 */
export const getUserTaskApi = (year, month) => {
  return uniFetch.get('/driver/users/taskReport', { year, month })
}
