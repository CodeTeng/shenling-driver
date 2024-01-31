<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { onLoad } from '@dcloudio/uni-app'
  import { useTaskStore } from '@/stores/task'
  import { truckRegistrationApi } from '@/apis/task'
  import slVehicleViolation from './components/vehicle-violation'
  import slVehicleBreakdown from './components/vehicle-breakdown'
  import slVehicleAccident from './components/vehicle-accident'

  const { recordData } = storeToRefs(useTaskStore())

  onLoad((query) => {
    recordData.value.id = query.transportTaskId
    recordData.value.startTime = query.actualDepartureTime
  })

  const onFormSubmit = async () => {
    // 过滤掉图片多余的数据，只保留 url
    const { accidentImagesList, faultImagesList } = recordData.value
    // 事故照片
    recordData.value.accidentImagesList = accidentImagesList.map(({ url }) => {
      return { url }
    })
    // 故障照片
    recordData.value.faultImagesList = faultImagesList.map(({ url }) => {
      return { url }
    })
    await truckRegistrationApi(recordData.value)
    // 跳转到任务列表
    uni.reLaunch({ url: '/pages/task/index' })
  }

  const enableSubmit = computed(() => {
    return (
      recordData.value.id &&
      recordData.value.startTime &&
      recordData.value.endTime
    )
  })
</script>
<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="scroll-view-wrapper">
        <uni-list class="base-info">
          <uni-list-item
            title="出车时间"
            show-arrow
            :right-text="recordData.startTime"
          />
          <uni-list-item show-arrow title="回车时间">
            <template v-slot:footer>
              <uni-datetime-picker
                :start="recordData.startTime"
                v-model="recordData.endTime"
              >
                <view class="picker-value">{{
                  recordData.endTime || '请选择'
                }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>
        </uni-list>
        <sl-vehicle-violation></sl-vehicle-violation>
        <sl-vehicle-breakdown></sl-vehicle-breakdown>
        <sl-vehicle-accident></sl-vehicle-accident>
      </view>
    </scroll-view>
    <view class="toolbar">
      <button :disabled="!enableSubmit" class="button" @click="onFormSubmit">
        提交登记
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
