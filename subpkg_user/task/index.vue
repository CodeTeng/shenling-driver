<script setup>
  import slUniCalendar from './components/sl-uni-calendar/sl-uni-calendar'
  import { onLoad } from '@dcloudio/uni-app'
  import { ref } from 'vue'
  import { getUserTaskApi } from '@/apis/user'

  const userTask = ref({})

  onLoad(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    getUserTask(year, month < 10 ? '0' + month : month)
  })

  const getUserTask = async (year, month) => {
    const res = await getUserTaskApi(year, month)
    userTask.value = res.data
  }

  const change = async ({ year, month }) => {
    await getUserTask(year, month)
  }
</script>

<template>
  <view class="page-container">
    <sl-uni-calendar :show-month="true" :insert="true" @change="change">
      <view class="data-overview">
        <view class="item">
          <text class="volumn">{{ userTask.completedAmounts }}</text>
          <text class="label">任务总量</text>
        </view>
        <view class="item">
          <text class="volumn">{{ userTask.taskAmounts }}</text>
          <text class="label">完成任务量</text>
        </view>
        <view class="item">
          <text class="volumn">{{ userTask.transportMileage }}</text>
          <text class="label">运输里程(km)</text>
        </view>
      </view>
    </sl-uni-calendar>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
