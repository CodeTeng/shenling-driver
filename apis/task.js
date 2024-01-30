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
