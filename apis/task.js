import { uniFetch } from './uni-fetch.js'

/**
 * 任务列表
 */
export const getPickUpListApi = (status, page = 1, pageSize = 5) => {
  return uniFetch.get('/driver/tasks/list', { status, page, pageSize })
}

/**
 * 任务详情
 */
export const getTaskDetailApi = (jobId) => {
  if (!jobId || jobId <= 0) return
  return uniFetch.get(`/driver/tasks/details/${jobId}`)
}

/**
 * 延迟提货
 */
export const delayTaskApi = (data) => {
  if (!data || !data.id || !data.delayTime || !data.delayReason) return
  return uniFetch.put('/driver/tasks/delay', data)
}

/**
 * 提货
 */
export const pickUpDeliveryApi = (data) => {
  if (!data || !data.id) return
  return uniFetch.post('/driver/tasks/takeDelivery', data)
}

/**
 * 上报异常
 */
export const reportExceptionApi = (data) => {
  if (!data || !data.transportTaskId) return
  return uniFetch.post('/driver/tasks/reportException', data)
}

/**
 * 交付
 */
export const deliveryTaskApi = (data) => {
  if (!data) return
  return uniFetch.post('/driver/tasks/deliver', data)
}

/**
 * 回车登记
 */
export const truckRegistrationApi = (data) => {
  if (!data) return
  return uniFetch.post('/driver/tasks/truckRegistration', data)
}
