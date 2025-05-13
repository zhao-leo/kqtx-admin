<template>
  <div class="login-form">
    <div class="form-header">账号密码登录</div>
    <div class="form-content">
      <div class="input-group">
        <input type="text" v-model="username" placeholder="请输入用户名" class="login-input" />
      </div>
      <div class="input-group">
        <input type="password" v-model="password" placeholder="请输入密码" class="login-input" />
      </div>
      <button class="login-btn" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }

  try {
    // TODO: 实现实际的登录逻辑
    console.log('登录信息:', {
      username: username.value,
      password: password.value,
    })

    // 模拟登录成功
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  }
}
</script>

<style scoped>
.login-form {
  width: 320px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
}

.form-content {
  margin-top: 20px;
}

.input-group {
  margin-bottom: 16px;
}

.login-input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
}

.login-input:focus {
  border-color: #409eff;
  outline: none;
}

.login-btn {
  width: 100%;
  height: 40px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #66b1ff;
}

.login-btn:active {
  background-color: #3a8ee6;
}
</style>
