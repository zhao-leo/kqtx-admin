<template>
  <div class="warm-notice">
    <el-input v-model="noticeContent" type="textarea" :rows="4" placeholder="请输入温馨提示内容" />
    <div class="button-group">
      <el-button type="success" @click="addNotice" :loading="loading">
        新增
      </el-button>
      <el-button type="primary" @click="submitNotice" :loading="loading">
        提交
      </el-button>
      <el-button @click="clearNotice" :disabled="loading">清空</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const noticeContent = ref('')
const loading = ref(false)

// 获取温馨提示内容
const getNotice = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/notice')
    noticeContent.value = response.data.content
  } catch (error) {
    ElMessage.error('获取温馨提示失败')
    console.error('获取温馨提示失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交温馨提示
const submitNotice = async () => {
  try {
    loading.value = true
    await axios.post('/api/notice', {
      content: noticeContent.value
    })
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}
// 新增温馨提示
const addNotice = async () => {
  try {
    loading.value = true
    await axios.post('/api/notice/add', {
      content: noticeContent.value
    })
    ElMessage.success('新增成功')
    // 重新获取列表
    await getNotice()
  } catch (error) {
    ElMessage.error('新增失败')
    console.error('新增失败:', error)
  } finally {
    loading.value = false
  }
}
// 清空温馨提示
const clearNotice = async () => {
  try {
    loading.value = true
    await axios.delete('/api/notice')
    noticeContent.value = ''
    ElMessage.success('清空成功')
  } catch (error) {
    ElMessage.error('清空失败')
    console.error('清空失败:', error)
  } finally {
    loading.value = false
  }
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
