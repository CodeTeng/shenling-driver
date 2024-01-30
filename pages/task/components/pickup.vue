<script setup>
  import { ref, onMounted } from 'vue'
  import { getPickUpListApi } from '@/apis/task'

  const pickUpList = ref([])
  const isEmpty = ref(false)
  const nextPage = ref(1)
  const hasMore = ref(true)
  const isTriggered = ref(false)

  onMounted(() => {
    getPickUpList()
  })

  const getPickUpList = async (page = 1, pageSize = 5) => {
    const res = await getPickUpListApi(1, page, pageSize)
    if (page === 1) pickUpList.value = []
    pickUpList.value = [...pickUpList.value, ...(res.data.items || [])]
    isEmpty.value = pickUpList.value.length === 0
    // 更新下一页页码
    nextPage.value = ++res.data.page
    hasMore.value = nextPage.value <= res.data.pages
  }

  const onScrollToLower = () => {
    // 没有数据了 直接返回
    if (!hasMore.value) return
    getPickUpList(nextPage.value)
  }

  const onScrollViewRefresh = async () => {
    isTriggered.value = true
    await getPickUpList()
    isTriggered.value = false
  }
</script>

<template>
  <scroll-view
    scroll-y
    refresher-enabled
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrollToLower"
    @refresherrefresh="onScrollViewRefresh"
    class="scroll-view"
  >
    <view class="scroll-view-wrapper">
      <view class="task-card" v-for="pickUp in pickUpList" :key="pickUp.id">
        <navigator
          hover-class="none"
          :url="`/subpkg_task/detail/index?id=${pickUp.id}`"
        >
          <view class="header">
            <text class="no">任务编号: {{ pickUp.transportTaskId }}</text>
            <!-- <text class="status">已延迟</text> -->
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ pickUp.startAddress }}</view>
              <view class="line">{{ pickUp.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer">
          <view class="label">提货时间</view>
          <view class="time">{{ pickUp.planDepartureTime }}</view>
          <navigator
            v-if="pickUp.enablePickUp"
            hover-class="none"
            :url="`/subpkg_task/pickup/index?id=${pickUp.id}`"
            class="action"
            >提货</navigator
          >
          <navigator v-else hover-class="none" url="" class="action disabled">
            提货
          </navigator>
        </view>
      </view>
      <view v-if="isEmpty" class="task-blank">无待提货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
