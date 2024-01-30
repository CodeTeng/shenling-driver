import { uniFetch } from './uni-fetch.js'

/**
 * 分页查询消息列表
 */
export const getTaskListApi = (contentType, page = 1, pageSize = 5) => {
  return uniFetch.get('/driver/messages/page', { contentType, page, pageSize })
}

/**
 * 全部已读
 */
export const allReadApi = (contentType) => {
  return uniFetch.put(`/driver/messages/readAll/${contentType}`)
}
