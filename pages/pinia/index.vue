<script setup>
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'
  const store = useCounterStore()
  const { count } = storeToRefs(store)
  const { increment, decrement } = store
</script>
<template>
  <view class="counter">
    <button class="button" @click="decrement" type="primary">-</button>
    <input class="input" :value="count" type="text" />
    <button class="button" @click="increment" type="primary">+</button>
  </view>
</template>

<style lang="scss" scoped>
  .counter {
    display: flex;
    padding: 100rpx;
  }

  .input {
    flex: 1;
    height: 96rpx;
    text-align: center;
    border: 2rpx solid #eee;
    box-sizing: border-box;
  }

  .button {
    width: 100rpx;
    margin: 0;

    &:first-child {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }
    &:last-child {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  }
</style>
