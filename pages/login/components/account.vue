<script setup>
  import { ref, reactive } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import { loginApi } from '@/apis/user'
  import { useUserStore } from '@/stores/user'

  const form = ref()
  const userStore = useUserStore()
  const formData = reactive({
    account: '',
    password: '',
  })
  const formDataRules = reactive({
    account: {
      rules: [
        { required: true, errorMessage: '请输入登录账号' },
        { pattern: '^[a-zA-Z0-9]{6,8}$', errorMessage: '登录账号格式不正确' },
      ],
    },
    password: {
      rules: [
        { required: true, errorMessage: '请输入登录密码' },
        { pattern: '^\\d{6,20}$', errorMessage: '登录密码格式不正确' },
      ],
    },
  })
  // 回跳地址
  const redirectUrl = ref('')
  // 跳转地址方式
  const routeType = ref('')

  // 获取地址中的参数
  onLoad((query) => {
    redirectUrl.value = query.redirectUrl
    routeType.value = query.routeType
  })
  const onSubmitForm = async () => {
    await form.value.validate()
    const { data } = await loginApi(formData)
    userStore.token = data
    // 地址重定向或switchTab
    uni.utils.toast('登录成功')
    uni[routeType.value]({ url: redirectUrl.value })
  }
</script>

<template>
  <uni-forms
    class="login-form"
    ref="form"
    :model="formData"
    :rules="formDataRules"
  >
    <uni-forms-item name="account">
      <input
        type="text"
        v-model="formData.account"
        placeholder="请输入账号"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <uni-forms-item name="password">
      <input
        type="text"
        v-model="formData.password"
        placeholder="请输入密码"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <button class="submit-button" @click="onSubmitForm">登录</button>
  </uni-forms>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
