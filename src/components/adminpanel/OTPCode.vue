<template>
  <div class="otp-code">
    <div class="code-container">
      <h3>动态验证码</h3>
      <div class="code-display">
        <span class="code">{{ otpCode || '获取中...' }}</span>
        <el-button v-if="otpCode" type="text" class="copy-button" @click="copyCode">
          <el-icon><Document /></el-icon>
          复制
        </el-button>
      </div>

      <div class="timer-container">
        <div class="timer-text">有效期: {{ formattedTime }}</div>
        <el-progress :percentage="timePercentage" :color="progressColor" :stroke-width="8" />
      </div>

      <div class="button-group">
        <el-button type="primary" @click="getOTPCode" :loading="loading" :disabled="isCountingDown">
          {{ isCountingDown ? '刷新倒计时中' : '刷新验证码' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { request } from '../../logic/register.js'

const otpCode = ref('')
const loading = ref(false)
const remainingTime = ref(0)
const totalTime = 240 // 4分钟 = 240秒
let countdownTimer = null

// 格式化剩余时间
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

// 计算倒计时百分比
const timePercentage = computed(() => {
  return ((remainingTime.value / totalTime) * 100).toFixed(2)
})

// 根据剩余时间计算进度条颜色
const progressColor = computed(() => {
  if (timePercentage.value > 50) {
    return '#67C23A' // 绿色
  } else if (timePercentage.value > 20) {
    return '#E6A23C' // 黄色
  } else {
    return '#F56C6C' // 红色
  }
})

// 是否在倒计时中
const isCountingDown = computed(() => {
  return remainingTime.value > 0
})

// 获取OTP验证码
const getOTPCode = async () => {
  try {
    loading.value = true
    const response = await request.get('/user/Changepermission')
    if (response.code === 200 && response.data) {
      otpCode.value = response.data.code || response.data
      startCountdown()
    } else {
      throw new Error('获取验证码失败')
    }
  } catch (error) {
    ElMessage.error('获取验证码失败')
    console.error('获取验证码失败:', error)
  } finally {
    loading.value = false
  }
}

// 复制验证码到剪贴板
const copyCode = () => {
  if (!otpCode.value) return

  navigator.clipboard
    .writeText(otpCode.value)
    .then(() => {
      ElMessage.success('验证码已复制到剪贴板')
    })
    .catch((err) => {
      ElMessage.error('复制失败')
      console.error('复制失败:', err)
    })
}

// 开始倒计时
const startCountdown = () => {
  // 清除现有计时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  // 设置初始时间
  remainingTime.value = totalTime

  // 设置计时器
  countdownTimer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      // 时间到，清除验证码
      otpCode.value = '已过期'
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 组件加载时获取验证码
onMounted(() => {
  getOTPCode()
})

// 组件卸载时清除计时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.otp-code {
  padding: 25px;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.otp-code:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.15);
}

.code-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.code-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.03);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code {
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #409eff;
  word-break: break-all;
  max-width: 100%;
  overflow-wrap: break-word;
  flex: 1;
  min-width: 0;
}

.timer-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timer-text {
  font-size: 14px;
  color: #606266;
  display: flex;
  justify-content: flex-end;
}

.button-group {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409eff, #60acff);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(45deg, #60acff, #409eff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--primary:disabled) {
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #409eff;
}

.copy-button:hover {
  color: #66b1ff;
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

.otp-code {
  animation: fadeIn 0.5s ease-out;
}
</style>
