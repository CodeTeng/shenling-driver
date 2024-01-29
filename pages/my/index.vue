<script setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { getUserInfoApi, getUserTaskApi } from '@/apis/user'

  const userInfo = ref({})
  const userTask = ref({})

  onLoad(() => {
    getUserInfo()
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    getUserTask(year, month < 10 ? '0' + month : month)
  })

  const getUserInfo = async () => {
    const res = await getUserInfoApi()
    userInfo.value = res.data
  }

  const getUserTask = async (year, month) => {
    const res = await getUserTaskApi(year, month)
    userTask.value = res.data
  }
</script>

<template>
  <view class="page-container">
    <view class="user-profile">
      <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
      <text class="username">{{ userInfo.name }}</text>
      <text class="no">司机编号：{{ userInfo.number }}</text>
      <text class="mobile">手机号码：{{ userInfo.phone }}</text>
    </view>
    <view class="month-overview">
      <view class="title">我的任务</view>
      <view class="content">
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
    </view>
    <view class="entry-list">
      <uni-list :border="false">
        <uni-list-item
          to="/subpkg_user/truck/index"
          showArrow
          title="车辆信息"
        />
        <uni-list-item
          to="/subpkg_user/task/index"
          showArrow
          title="任务数据"
        />
        <uni-list-item
          to="/subpkg_user/settings/index"
          showArrow
          title="系统设置"
        />
      </uni-list>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
