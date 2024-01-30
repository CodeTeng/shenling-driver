<script setup>
  import { ref, onMounted } from 'vue'
  import { getTaskListApi, allReadApi } from '@/apis/message'

  const notifyList = ref([])
  const isEmpty = ref(false)
  const nextPage = ref(1)
  const hasMore = ref(true)
  const isTriggered = ref(false)

  onMounted(() => {
    getTaskList()
  })

  const getTaskList = async (page = 1, pageSize = 5) => {
    const res = await getTaskListApi(201, page, pageSize)
    // 清空原始的数据
    if (page === 1) notifyList.value = []
    notifyList.value = [...notifyList.value, ...(res.data.items || [])]
    isEmpty.value = notifyList.value.length === 0
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
      <uni-card
        :border="false"
        v-for="notify in notifyList"
        :key="notify.id"
        :is-shadow="false"
      >
        <view class="brief">{{ notify.content }}</view>
        <view class="extra">
          <text class="time">{{ notify.created }}</text>
          <navigator
            hover-class="none"
            class="link"
            :url="`/subpkg_task/detail/index?id=${notify.id}`"
            >查看详情</navigator
          >
        </view>
        <template v-slot:title>
          <view class="title" :class="{ unread: !notify.isRead }"
            >您有新的运输任务</view
          >
        </template>
      </uni-card>
      <view v-if="isEmpty" class="message-blank">暂无消息</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
