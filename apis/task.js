import { uniFetch } from './uni-fetch.js'

/**
 * 任务列表
 */
export const getPickUpListApi = (status, page = 1, pageSize = 5) => {
  return uniFetch.get('/driver/tasks/list', { status, page, pageSize })
}
