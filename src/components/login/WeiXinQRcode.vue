<template>
  <div class="qrcode-login">
    <div v-if="isLoading" class="loading">
      <img src="@/assets/images/loading.gif" alt="加载中" class="loading-img" />
    </div>
    <div v-else class="qrcode-wrapper">
      <div class="qrcode-box">
        <img :src="qrcodeUrl" alt="登录二维码" class="custom-qrcode" v-if="qrcodeUrl" />
      </div>
      <p class="qrcode-tip">请使用微信扫描二维码登录</p>
      <p class="qrcode-refresh" @click="refreshQRCode">二维码已失效？点击刷新</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const qrcodeUrl = ref('')
const salt = ref('')
// 添加一个控制变量以防止组件卸载后的操作
const isComponentMounted = ref(true)
// 添加一个变量存储轮询定时器的ID
const pollInterval = ref(null)

// 生成随机 salt 的函数
const generateSalt = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const fetchQRCode = async () => {
  if (!isComponentMounted.value) return

  // 停止已有的轮询
  stopPolling()

  isLoading.value = true
  try {
    // 生成新的 salt
    salt.value = generateSalt()

    // 在 URL 中添加 salt 参数
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/qrcode?salt=${salt.value}`, {
      responseType: 'blob'
    })

    // 确保组件仍然挂载
    if (!isComponentMounted.value) {
      return
    }

    // 将二进制数据转换为 Blob URL
    const blob = new Blob([response.data], { type: 'image/png' })

    // 先清理之前的 URL
    if (qrcodeUrl.value) {
      URL.revokeObjectURL(qrcodeUrl.value)
    }

    qrcodeUrl.value = URL.createObjectURL(blob)

    // 开始轮询检查登录状态
    startPolling()
  } catch (error) {
    if (isComponentMounted.value) {
      console.error('获取二维码失败:', error)
    }
  } finally {
    if (isComponentMounted.value) {
      isLoading.value = false
    }
  }
}

// 开始轮询检查登录状态
const startPolling = () => {
  if (!isComponentMounted.value) return

  // 每秒检查一次登录状态
  pollInterval.value = setInterval(async () => {
    if (!isComponentMounted.value) {
      stopPolling()
      return
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/web_login?salt=${salt.value}`)

      // 如果已登录成功
      if (response.data.success) {
        // 停止轮询
        stopPolling()

        // 处理登录成功逻辑，例如保存 token 并跳转
        if (response.data.token) {
          // 假设您使用 Pinia 存储 token
          const { useAuthStore } = await import('@/stores/token')
          const authStore = useAuthStore()
          authStore.setToken(response.data.token)

          // 跳转到首页或控制台
          router.push('/dashboard')
        }
      }
    } catch (error) {
      // 网络错误或后端接口错误，可以选择忽略或记录日志
      if (isComponentMounted.value) {
        console.log('检查登录状态出错:', error)
      }
    }
  }, 1000) // 每秒轮询一次
}

// 停止轮询
const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
}

const refreshQRCode = () => {
  // 释放之前的 Blob URL 以避免内存泄漏
  if (qrcodeUrl.value) {
    URL.revokeObjectURL(qrcodeUrl.value)
    qrcodeUrl.value = ''
  }
  fetchQRCode()
}

onMounted(() => {
  isComponentMounted.value = true
  fetchQRCode()
})

// 组件销毁时清理资源
onBeforeUnmount(() => {
  isComponentMounted.value = false
  stopPolling()

  // 确保清理所有资源
  if (qrcodeUrl.value) {
    URL.revokeObjectURL(qrcodeUrl.value)
    qrcodeUrl.value = ''
  }
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

.custom-qrcode {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
