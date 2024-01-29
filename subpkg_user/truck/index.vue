<script setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { getUserTruckApi } from '@/apis/user'

  const userTruck = ref({})

  onLoad(() => {
    getUserTruck()
  })

  const getUserTruck = async () => {
    const res = await getUserTruckApi()
    userTruck.value = res.data
  }
</script>

<template>
  <view class="page-container">
    <swiper
      class="truck-pictures"
      indicator-active-color="#fff"
      circular
      indicator-dots
    >
      <swiper-item v-for="picture in userTruck.pictureList" :key="picture.url">
        <image class="picture" mode="aspectFill" :src="picture.url"></image>
      </swiper-item>
    </swiper>
    <view class="truck-meta">
      <uni-list :border="false">
        <uni-list-item
          :border="false"
          title="车辆编号"
          :right-text="userTruck.id"
        />
        <uni-list-item
          :border="false"
          title="车辆号牌"
          :right-text="userTruck.licensePlate"
        />
        <uni-list-item
          :border="false"
          title="车型"
          :right-text="userTruck.truckType"
        />
        <uni-list-item
          :border="false"
          title="所属机构"
          :right-text="userTruck.currentOrganName"
        />
        <uni-list-item
          :border="false"
          title="载重"
          :right-text="userTruck.allowableLoad"
        />
      </uni-list>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
