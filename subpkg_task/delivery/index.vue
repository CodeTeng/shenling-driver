<script setup>
  import { ref, computed } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { deliveryTaskApi } from '@/apis/task'

  const id = ref('')
  const receiptPictrues = ref([])
  const goodsPictrues = ref([])

  onLoad((query) => {
    id.value = query.id
  })

  const onSubmitForm = async () => {
    const formData = {
      id: id.value,
      certificatePictureList: certificatePictureList.value,
      deliverPictureList: deliverPictureList.value,
    }
    await deliveryTaskApi(formData)
    uni.reLaunch({ url: '/pages/task/index' })
  }

  const certificatePictureList = computed(() => {
    return receiptPictrues.value.map(({ url }) => {
      return { url }
    })
  })
  const deliverPictureList = computed(() => {
    return goodsPictrues.value.map(({ url }) => {
      return { url }
    })
  })
  const enableSubmit = computed(() => {
    return goodsPictrues.value.length > 0 && receiptPictrues.value.length > 0
  })
</script>

<template>
  <view class="page-container">
    <view class="receipt-info">
      <uni-file-picker
        limit="3"
        v-model="receiptPictrues"
        file-extname="jpg,webp,gif,png"
        title="请拍照上传回单凭证"
      ></uni-file-picker>
      <uni-file-picker
        limit="3"
        file-extname="jpg,webp,gif,png"
        v-model="goodsPictrues"
        title="请拍照上传货品照片"
      ></uni-file-picker>
    </view>
    <button :disabled="!enableSubmit" @click="onSubmitForm" class="button">
      提交
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .page-container {
    padding: 30rpx;
  }

  .receipt-info {
    min-height: 600rpx;
    background-color: #fff;
    padding: 20rpx 30rpx;
    border-radius: 16rpx;

    ::v-deep .uni-file-picker {
      margin-bottom: 30rpx;
    }
  }

  .button {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    /* #ifdef APP */
    padding-top: 4rpx;
    /* #endif */
    border-radius: 100rpx;
    margin-top: 60rpx;
    color: #fff;
    font-size: $uni-font-size-big;
    background-color: $uni-primary;

    &[disabled] {
      color: #fff;
      background-color: #fadcd9;
    }
  }
</style>
