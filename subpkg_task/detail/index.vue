<script setup>
  import { onLoad } from '@dcloudio/uni-app'
  import { ref } from 'vue'
  import { getTaskDetailApi } from '@/apis/task'

  const taskDetail = ref({})
  const isCargoPickUpPictureEmpty = ref(false)
  const isCargoPictureEmpty = ref(false)
  const isCertificatePictureEmpty = ref(false)
  const isDeliverPictureEmpty = ref(false)

  onLoad((params) => {
    getTaskDetail(params.id)
  })

  const getTaskDetail = async (jobId) => {
    const res = await getTaskDetailApi(jobId)
    taskDetail.value = res.data
    isCargoPickUpPictureEmpty.value =
      res.data.cargoPickUpPictureList?.length === 0
    isCargoPictureEmpty.value = res.data.cargoPictureList?.length === 0
    isCertificatePictureEmpty.value =
      res.data.certificatePictureList?.length === 0
    isDeliverPictureEmpty.value = res.data.deliverPictureList?.length === 0
  }
</script>

<template>
  <view class="page-container">
    <view class="search-bar">
      <!-- #ifdef H5 -->
      <text class="iconfont icon-search"></text>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS | MP -->
      <text class="iconfont icon-scan"></text>
      <!-- #endif -->
      <input class="input" type="text" placeholder="输入运单号" />
    </view>
    <scroll-view scroll-y class="task-detail">
      <view class="scroll-view-wrapper">
        <view class="basic-info panel">
          <view class="panel-title">基本信息</view>
          <view class="timeline">
            <view class="line">{{ taskDetail.startAddress }}</view>
            <view class="line">{{ taskDetail.endAddress }}</view>
            <navigator
              hover-class="none"
              :url="`/subpkg_task/guide/index?transportTaskId=${taskDetail.transportTaskId}&startAddress=${taskDetail.startAddress}&endAddress=${taskDetail.endAddress}`"
              class="guide"
            >
              <text class="iconfont icon-guide"></text>
              <text>开始导航</text>
            </navigator>
          </view>
          <view class="info-list">
            <view class="info-list-item">
              <text class="label">任务编号</text>
              <text class="value">{{ taskDetail.transportTaskId }}</text>
            </view>

            <!-- 待提货展示数据 -->
            <template v-if="taskDetail.status >= 1">
              <view class="info-list-item">
                <text class="label">提货联系人</text>
                <text class="value">{{ taskDetail.startHandoverName }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">联系电话</text>
                <text class="value">{{ taskDetail.startHandoverPhone }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">预计提货时间</text>
                <text class="value">{{ taskDetail.planDepartureTime }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">实际提货时间</text>
                <text class="value">{{ taskDetail.actualDepartureTime }}</text>
              </view>
            </template>

            <!-- 在途展示数据 -->
            <template v-if="taskDetail.status === 2">
              <view
                style="margin: 20rpx 0; border-bottom: 1rpx solid #f4f4f4"
              ></view>
              <view class="info-list-item">
                <text class="label">交付联系人</text>
                <text class="value">{{ taskDetail.finishHandoverName }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">联系电话</text>
                <text class="value">{{ taskDetail.finishHandoverPhone }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">预计送达时间</text>
                <text class="value">{{ taskDetail.planArrivalTime }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">实际送达时间</text>
                <text class="value">{{ taskDetail.actualArrivalTime }}</text>
              </view>
            </template>
          </view>
        </view>

        <!-- 已交付 -->
        <template v-if="taskDetail.exceptionList">
          <view class="except-info panel">
            <view class="panel-title">异常信息</view>
            <view
              class="info-list"
              v-for="exception in taskDetail.exceptionList"
              :key="exception.exceptionType"
            >
              <view class="info-list-item">
                <text class="label">上报时间</text>
                <text class="value">{{ exception.exceptionTime }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">异常类型</text>
                <text class="value">{{ exception.exceptionType }}</text>
              </view>
              <view class="info-list-item">
                <text class="label">处理结果</text>
                <text class="value">{{ exception.handleResult }}</text>
              </view>
            </view>
          </view>
        </template>

        <template v-if="taskDetail.status >= 2">
          <view class="panel pickup-info">
            <view class="panel-title">提货信息</view>
            <view class="label">提货凭证</view>
            <view class="pictures">
              <image
                v-for="cargoPicture in taskDetail.cargoPictureList"
                :key="cargoPicture.url"
                class="picture"
                :src="cargoPicture.url"
                mode="aspectFill"
              ></image>
              <view v-if="isCargoPictureEmpty" class="picture-blank"
                >暂无图片</view
              >
            </view>
            <view class="label">货品照片</view>
            <view class="pictures">
              <image
                class="picture"
                v-for="cargoPickUpPicture in taskDetail.cargoPickUpPictureList"
                :key="cargoPickUpPicture.url"
                :src="cargoPickUpPicture.url"
                mode="aspectFill"
              ></image>
              <view v-if="isCargoPickUpPictureEmpty" class="picture-blank"
                >暂无图片</view
              >
            </view>
          </view>
        </template>

        <template v-if="taskDetail.status === 4 || taskDetail.status === 6">
          <view class="delivery-info panel">
            <view class="panel-title">交货信息</view>
            <view class="label">交货凭证</view>
            <view class="pictures">
              <image
                v-for="certificatePicture in taskDetail.certificatePictureList"
                :key="certificatePicture.url"
                class="picture"
                :src="certificatePicture.url"
                mode="aspectFill"
              ></image>
              <view v-if="isCertificatePictureEmpty" class="picture-blank"
                >暂无图片</view
              >
            </view>
            <view class="label">货品照片</view>
            <view class="pictures">
              <image
                v-for="deliverPicture in taskDetail.deliverPictureList"
                :key="deliverPicture.url"
                class="picture"
                :src="deliverPicture.url"
                mode="aspectFill"
              ></image>
              <view v-if="isDeliverPictureEmpty" class="picture-blank"
                >暂无图片</view
              >
            </view>
          </view>
        </template>
      </view>
    </scroll-view>

    <view class="toolbar" v-if="taskDetail.status === 1">
      <navigator
        :url="`/subpkg_task/delay/index?id=${taskDetail.id}&planDepartureTime=${taskDetail.planDepartureTime}`"
        hover-class="none"
        class="button secondary"
        >延迟提货</navigator
      >
      <navigator
        :url="`/subpkg_task/pickup/index?id=${taskDetail.id}`"
        hover-class="none"
        class="button primary"
        >提货</navigator
      >
    </view>
    <view class="toolbar" v-if="taskDetail.status === 2">
      <navigator
        :url="`/subpkg_task/except/index?transportTaskId=${taskDetail.transportTaskId}`"
        hover-class="none"
        class="button secondary"
        >异常上报
      </navigator>
      <navigator
        :url="`/subpkg_task/delivery/index?id=${taskDetail.id}`"
        hover-class="none"
        class="button primary"
        >支付</navigator
      >
    </view>
    <view class="toolbar" v-if="taskDetail.status === 4">
      <navigator
        :url="`/subpkg_task/record/index?transportTaskId=${taskDetail.transportTaskId}&actualDepartureTime=${taskDetail.actualDepartureTime}`"
        hover-class="none"
        class="button primary block"
        >回车登记</navigator
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
