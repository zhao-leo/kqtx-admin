<template>
  <div class="qrcode-login">
    <div v-if="isLoading" class="loading">
      <img src="@/assets/images/loading.gif" alt="加载中" class="loading-img" />
    </div>
    <div v-else class="qrcode-wrapper">
      <div id="wx-qrcode" class="qrcode-box">
        <!-- 微信二维码将在这里显示 -->
      </div>
      <p class="qrcode-tip">请使用微信扫描二维码登录</p>
      <p class="qrcode-refresh" @click="refreshQRCode">二维码已失效？点击刷新</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(false)
const wx_appid = import.meta.env.VITE_WX_APPID
const initWxLogin = () => {
  if (typeof window.WxLogin === 'undefined') {
    console.error('微信登录 SDK 未加载')
    return
  }

  isLoading.value = true
  try {
    new window.WxLogin({
      self_redirect: false,
      id: 'wx-qrcode',
      appid: wx_appid,
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent('http://localhost:8000/redirect'),
      state: 'STATE',
      style: 'black',
    })
  } catch (error) {
    console.error('初始化微信登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshQRCode = () => {
  isLoading.value = true
  initWxLogin()
}

onMounted(() => {
  initWxLogin()
})
</script>

<style scoped>
.qrcode-login {
  width: 320px;
  padding-bottom: 10px;
  padding-top: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-wrapper {
  text-align: center;
}

.qrcode-box {
  width: 300px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  /* 添加这行 */
  justify-content: center;
  /* 添加这行 */
  align-items: center;
  /* 添加这行 */
}

/* 调整iframe大小 */
.qrcode-box iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 400px;
  transform: scale(0.85);
  transform-origin: center center;
}

.qrcode-tip {
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
}

.qrcode-refresh {
  margin-top: 8px;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}

.qrcode-refresh:hover {
  color: #66b1ff;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-img {
  width: 32px;
  height: 32px;
}
</style>
