<script setup>
  import { ref, computed, reactive } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { reportExceptionApi } from '@/apis/task'

  const popup = ref(null)
  const timePicker = ref('')
  const exceptionPlace = ref('')
  const exceptionTypes = reactive([
    { text: '发动机启动困难', checked: false },
    { text: '不着车，漏油', checked: false },
    { text: '照明失灵', checked: false },
    { text: '排烟异常、温度异常', checked: false },
    { text: '其他问题', checked: false },
  ])
  const exceptionType = ref('')
  const exceptionDescribe = ref('')
  const goodsPictrues = ref([])
  const transportTaskId = ref('')

  onLoad((query) => {
    transportTaskId.value = query.transportTaskId
  })

  const exceptionImagesList = computed(() => {
    return goodsPictrues.value.map(({ url }) => {
      return { url }
    })
  })
  const wordsCount = computed(() => {
    return exceptionDescribe.value.length
  })
  const exceptionTime = computed(() => {
    return timePicker.value || '请选择'
  })
  const onCheckboxChange = (index) => {
    // 切换选中状态
    exceptionTypes[index].checked = !exceptionTypes[index].checked
  }

  // 打开地图
  const onLocationChoose = async () => {
    // 获取位置
    const { address } = await uni.chooseLocation()
    exceptionPlace.value = address
  }

  // 关闭弹层
  const onPopupClose = () => {
    popup.value.close()
    // 获取用户选择的类型并回显到页面，即将 checked 属性为 true 单元取出
    exceptionType.value = exceptionTypes
      .filter((type) => {
        return type.checked // 过滤出选中的类型
      })
      .map((type) => {
        return type.text // 只保留 text 属性
      })
      .join('|') // 将选择的类型用 | 拼接并回显
  }

  // 打开弹层
  const onPopupOpen = () => {
    popup.value.open()
  }

  const enableSubmit = computed(() => {
    return (
      !exceptionTime.value ||
      !exceptionPlace.value ||
      !exceptionType.value ||
      wordsCount.value <= 0 ||
      wordsCount.value > 50
    )
  })

  const onSubmitForm = async () => {
    const formData = {
      transportTaskId: transportTaskId.value,
      exceptionTime: exceptionTime.value,
      exceptionPlace: exceptionPlace.value,
      exceptionType: exceptionType.value,
      exceptionDescribe: exceptionDescribe.value,
      exceptionImagesList: exceptionImagesList.value,
    }
    await reportExceptionApi(formData)
    // 跳转到任务列表页面
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>

<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view style="margin: 30rpx" class="scroll-view-wrapper">
        <uni-list :border="false">
          <uni-list-item show-arrow title="异常时间">
            <template v-slot:footer>
              <uni-datetime-picker v-model="timePicker">
                <view class="picker-value">{{ exceptionTime }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>

          <uni-list-item
            show-arrow
            clickable
            ellipsis="1"
            @click="onLocationChoose"
            title="上报位置"
            :rightText="exceptionPlace || '请选择'"
          />
          <uni-list-item
            show-arrow
            clickable
            @click="onPopupOpen"
            title="异常类型"
            :rightText="exceptionType || '请选择'"
          />
          <uni-list-item direction="column" title="异常描述">
            <template v-slot:footer>
              <view class="textarea-wrapper">
                <textarea
                  class="textarea"
                  v-model="exceptionDescribe"
                  placeholder="请输入异常描述"
                ></textarea>
                <view :class="{ error: wordsCount > 50 }" class="words-count"
                  >{{ wordsCount }}/50</view
                >
              </view>
            </template>
          </uni-list-item>
          <uni-list-item
            :border="false"
            style="margin-top: -30rpx"
            direction="column"
            title="上传图片（最多3张）"
          >
            <template v-slot:footer>
              <uni-file-picker
                v-model="goodsPictrues"
                file-extname="jpg,webp,gif,png"
                limit="3"
              ></uni-file-picker>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </scroll-view>
    <view class="fixbar">
      <button :disabled="enableSubmit" @click="onSubmitForm" class="button">
        提交
      </button>
    </view>
    <!-- 异常类型弹层 -->
    <uni-popup ref="popup" :mask-click="false" type="bottom">
      <uni-list class="popup-action-sheet">
        <uni-list-item>
          <template v-slot:header>
            <view class="header">选择类型</view>
          </template>
        </uni-list-item>
        <uni-list-item
          v-for="(exceptionType, index) in exceptionTypes"
          :key="exceptionType.text"
          :title="exceptionType.text"
        >
          <template v-slot:footer>
            <checkbox-group @change="onCheckboxChange(index)" class="checkbox">
              <checkbox :checked="exceptionType.checked" color="#EF4F3F" />
            </checkbox-group>
          </template>
        </uni-list-item>
        <uni-list-item>
          <template v-slot:body>
            <button @click="onPopupClose" class="button">确定</button>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
