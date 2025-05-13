<template>
  <div class="warm-notice">
    <el-input v-model="noticeContent" type="textarea" :rows="4" placeholder="请输入温馨提示内容" />
    <div class="button-group">
      <el-button type="primary" @click="submitNotice" :loading="loading"> 提交 </el-button>
      <el-button @click="clearNotice" :disabled="loading">清空</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/token.js'

const noticeContent = ref('')
const loading = ref(false)
const api = import.meta.env.VITE_API_BASE_URL + '/community/warm_notice'
const token = useAuthStore().getToken()
axios.defaults.headers.common['Authorization'] = token
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'

// 获取温馨提示内容
const getNotice = async () => {
  try {
    loading.value = true
    const response = await axios.get(api)
    noticeContent.value = response.data.data.notice
  } catch (error) {
    ElMessage.error('获取温馨提示失败')
    console.error('获取温馨提示失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交温馨提示
const submitNotice = async () => {
  const formdata = new FormData()
  formdata.append('notice', noticeContent.value)
  try {
    loading.value = true
    await axios.put(api, formdata)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 清空温馨提示
const clearNotice = async () => {
  noticeContent.value = ''
  submitNotice()
}

// 组件加载时获取温馨提示
onMounted(() => {
  getNotice()
})
</script>

<style scoped>
.warm-notice {
  padding: 20px;
  max-width: 600px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
