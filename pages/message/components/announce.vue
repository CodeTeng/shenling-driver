<script setup>
  import { ref, onMounted } from 'vue'
  import { getTaskListApi, allReadApi } from '@/apis/message'

  const announceList = ref([])
  const isEmpty = ref(false)
  const nextPage = ref(1)
  const hasMore = ref(true)
  const isTriggered = ref(false)

  onMounted(() => {
    getTaskList()
  })

  const getTaskList = async (page = 1, pageSize = 10) => {
    const res = await getTaskListApi(200, page, pageSize)
    // 清空原始的数据
    if (page === 1) announceList.value = []
    announceList.value = [...announceList.value, ...(res.data.items || [])]
    isEmpty.value = announceList.value.length === 0
    // 更新下一页页码
    nextPage.value = ++res.data.page
    hasMore.value = nextPage.value <= res.data.pages
  }

  const onScrollToLower = () => {
    // 没有数据了 直接返回
    if (!hasMore.value) return
    getTaskList(nextPage.value)
  }

  const onScrollViewRefresh = async () => {
    isTriggered.value = true
    await getTaskList()
    isTriggered.value = false
  }

  const onAllRead = async () => {
    await allReadApi(201)
    getTaskList()
  }
</script>
<template>
  <scroll-view
    class="scroll-view"
    refresher-enabled
    scroll-y
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onScrollViewRefresh"
  >
    <view class="scroll-view-wrapper">
      <view class="message-action" @click="onAllRead">
        <text class="iconfont icon-clear"></text>
        全部已读
      </view>
      <uni-list :border="false">
        <uni-list-item
          v-for="announce in announceList"
          :key="announce.id"
          :to="`/subpkg_message/content/index?id=${announce.id}`"
          ellipsis="1"
          :title="announce.title"
          :right-text="announce.created"
        >
          <template v-slot:header>
            <text v-if="announce.isRead" class="dot"></text>
          </template>
        </uni-list-item>
      </uni-list>
      <view v-if="isEmpty" class="message-blank">暂无消息</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
