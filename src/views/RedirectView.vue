<template>
  <div class="redirect-page">
    <div v-if="loading" class="loading">
      <el-spinner size="large" />
      <p>正在处理登录请求...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(true)

const BASEURL = import.meta.env.VITE_API_BASE_URL || ''
const validateLogin = async (code) => {
  try {
    const response = await axios.post(`${BASEURL}/asfd`, { code })
    if (response.data.status === 'success') {
      router.replace('/dashboard')
    } else {
      // 使用 ElMessageBox 替代 alert
      await ElMessageBox.alert(
        `登录失败，请重试: ${response.data.message || '未知错误'}`,
        '提示',
        {
          confirmButtonText: '确定',
          type: 'error'
        }
      )
      router.replace('/login')
    }
  } catch (error) {
    await ElMessageBox.alert(
      `登录失败，请重试: ${error.message || '未知错误'}`,
      '提示',
      {
        confirmButtonText: '确定',
        type: 'error'
      }
    )
    router.replace('/login')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const code = route.query.code

  if (!code) {
    // 如果没有code参数，直接返回登录页
    router.replace('/login')
    return
  }

  // 有code参数，进行验证
  validateLogin(code)
})
</script>

<style scoped>
.redirect-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading {
  text-align: center;
}

.loading p {
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
}
</style>
