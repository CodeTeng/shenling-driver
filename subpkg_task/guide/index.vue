<script setup>
  import { ref } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'

  // 初始经纬度
  const latitude = ref(39.909)
  const longitude = ref(116.39742)
  const id = ref('')
  const startAddress = ref('')
  const endAddress = ref('')

  onLoad((query) => {
    id.value = query.transportTaskId
    startAddress.value = query.startAddress
    endAddress.value = query.endAddress
  })

  const onNavigation = () => {
    console.log('开始导航')
  }
</script>

<template>
  <view class="page-container">
    <map :latitude="latitude" :longitude="longitude" class="map"></map>
    <cover-view class="meta">
      <cover-view class="label">任务编号: {{ id }}</cover-view>
      <cover-view class="timeline">
        <cover-view class="start">起</cover-view>
        <cover-view class="end">止</cover-view>
        <cover-view class="line">{{ startAddress }}</cover-view>
        <cover-view class="line">{{ endAddress }}</cover-view>
      </cover-view>
    </cover-view>
    <cover-view class="toolbar">
      <cover-view class="button" @click="onNavigation">导航</cover-view>
    </cover-view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
