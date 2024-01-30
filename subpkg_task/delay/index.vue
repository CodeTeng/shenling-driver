<script setup>
  import { onLoad } from '@dcloudio/uni-app'
  import { ref, computed } from 'vue'
  import { delayTaskApi } from '@/apis/task'

  const planDepartureTime = ref('')
  const id = ref('')
  // 延迟提货时间
  const delayTime = ref('')
  // 验证延迟时间
  const delayTimeValid = computed(() => {
    const start = new Date(planDepartureTime.value)
    const end = new Date(delayTime.value)
    // 时间差区间在 0 ~ 7200 * 1000 毫秒
    return end - start > 0 && end - start <= 7200 * 1000
  })
  // 延迟原因
  const delayReason = ref('')
  const wordCount = computed(() => delayReason.value.length)
  // 验证延迟原因
  const delayReasonValid = computed(
    () => wordCount.value <= 50 && wordCount.value > 0
  )

  onLoad((query) => {
    // 原计划提货时间
    planDepartureTime.value = query.planDepartureTime
    // 延迟提货任务的ID
    id.value = query.id
  })

  const onPickerChange = (e) => {
    const date = planDepartureTime.value.split(' ')[0]
    delayTime.value = `${date} ${e.detail.value}`
  }

  const enableSubmit = computed(
    () => !delayReasonValid.value || !delayTimeValid.value
  )

  const onSubmitForm = async () => {
    const formData = {
      id: id.value,
      delayTime: delayTime.value,
      delayReason: delayReason.value,
    }
    await delayTaskApi(formData)
    // 跳转到任务列表
    uni.reLaunch({
      url: '/pages/task/index',
    })
  }
</script>

<template>
  <view class="page-container">
    <uni-list :border="false">
      <uni-list-item
        title="原定时间 "
        showArrow
        :rightText="planDepartureTime"
      />
      <uni-list-item title="延迟时间" showArrow>
        <template v-slot:footer>
          <picker class="time-picker" @change="onPickerChange" mode="time">
            <text v-if="!delayTime">不可超过2个小时</text>
            <text :class="{ error: !delayTimeValid }" v-else>{{
              delayTime + ':00'
            }}</text>
          </picker>
        </template>
      </uni-list-item>
      <uni-list-item direction="column">
        <template v-slot:body>
          <view class="textarea-wrapper">
            <textarea
              class="textarea"
              v-model="delayReason"
              placeholder-style="color: #818181"
              placeholder="请输入延迟提货原因"
            ></textarea>
            <text :class="{ error: !delayReasonValid }" class="words-count"
              >{{ wordCount }}/50</text
            >
          </view>
        </template>
      </uni-list-item>
      <uni-list-item :border="false">
        <template v-slot:body>
          <button @click="onSubmitForm" :disabled="enableSubmit" class="button">
            提交
          </button>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
