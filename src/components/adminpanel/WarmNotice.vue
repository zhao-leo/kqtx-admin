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
  padding: 25px;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.warm-notice:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.15);
}

:deep(.el-textarea) {
  --el-input-text-color: rgba(16, 16, 16, 0.9);
  color: rgba(24, 24, 24, 0.9);
}

:deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  caret-color: #409EFF;
}

:deep(.el-textarea__inner:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-textarea__inner:focus) {
  background: rgba(255, 255, 255, 0.05);
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

:deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

.button-group {
  margin-top: 25px;
  display: flex;
  gap: 15px;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409EFF, #60ACFF);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(45deg, #60ACFF, #409EFF);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--default) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-button--default:hover) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

:deep(.el-button--default:disabled) {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warm-notice {
  animation: fadeIn 0.5s ease-out;
}
</style>
