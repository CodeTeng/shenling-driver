<script setup>
  import { ref, onMounted } from 'vue'
  import { getPickUpListApi } from '@/apis/task'

  // 在途任务列表
  const deliveryList = ref([])
  // 在途列任务列表是否为空
  const isEmpty = ref(false)
  const nextPage = ref(1)
  const hasMore = ref(true)
  const isTriggered = ref(false)

  onMounted(() => {
    getDeliveryList()
  })

  const getDeliveryList = async (page = 1, pageSize = 5) => {
    const res = await getPickUpListApi(2, page, pageSize)
    if (page === 1) deliveryList.value = []
    deliveryList.value = [...deliveryList.value, ...(res.data.items || [])]
    isEmpty.value = deliveryList.value.length === 0
    // 更新下一页页码
    nextPage.value = ++res.data.page
    hasMore.value = nextPage.value <= res.data.pages
  }

  const onScrollToLower = () => {
    // 没有数据了 直接返回
    if (!hasMore.value) return
    getDeliveryList(nextPage.value)
  }

  const onScrollViewRefresh = async () => {
    isTriggered.value = true
    await getDeliveryList()
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
      <view
        class="task-card"
        v-for="delivery in deliveryList"
        :key="delivery.id"
      >
        <navigator
          hover-class="none"
          :url="`/subpkg_task/detail/index?id=${delivery.id}`"
        >
          <view class="header">
            <text class="no">任务编号: {{ delivery.transportTaskId }}</text>
          </view>
          <view class="body">
            <view class="timeline">
              <view class="line">{{ delivery.startAddress }}</view>
              <view class="line">{{ delivery.endAddress }}</view>
            </view>
          </view>
        </navigator>
        <view class="footer">
          <view class="label">到货时间</view>
          <view class="time">{{ delivery.planArrivalTime }}</view>
          <navigator
            v-if="delivery.status === 2"
            hover-class="none"
            :url="`/subpkg_task/delivery/index?id=${delivery.id}`"
            class="action"
          >
            交付
          </navigator>
          <navigator
            v-if="delivery.status === 4"
            hover-class="none"
            :url="`/subpkg_task/record/index?transportTaskId=${delivery.transportTaskId}&actualDepartureTime=${delivery.actualDepartureTime}`"
            class="action"
          >
            回车登记
          </navigator>
        </view>
      </view>
      <view v-if="isEmpty" class="task-blank">无在途货物</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
