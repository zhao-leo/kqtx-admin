<template>
  <div class="dashboard">
    <header class="head">
      <div class="head-content">
        <h1 class="head-title">矿桥东街社区服务数据管理平台</h1>
        <div class="head-right">
          <button class="login-btn">{{ currentTime }}</button>
          <button class="login-btn" @click="goToLogin">登录</button>
        </div>
      </div>
    </header>
    <div class="mainbox">
      <ul class="clearfix nav1">
        <li style="width: 33%">
          <ComplainSituation />
          <KeyPeople />
        </li>
        <li style="width: 33%">
          <BaiduMap />
          <CategoryCount />
        </li>
        <li style="width: 33%">
          <RecommendHandle />
          <MiniProgramUsage />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import '../assets/panel.css'
import { ref, onMounted, onUnmounted } from 'vue'
import ComplainSituation from '@/components/panel/ComplainSituation.vue'
import KeyPeople from '@/components/panel/KeyPeople.vue'
import BaiduMap from '@/components/panel/BaiduMap.vue'
import CategoryCount from '@/components/panel/CategoryCount.vue'
import RecommendHandle from '@/components/panel/RecommendHandle.vue'
import MiniProgramUsage from '@/components/panel/MiniProgramUsage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
const currentTime = ref('')

// 更新时间的函数
const updateTime = () => {
  const dt = new Date()
  const y = dt.getFullYear()
  const mt = dt.getMonth() + 1
  const day = dt.getDate()
  const h = dt.getHours()
  const m = dt.getMinutes()
  const s = dt.getSeconds()
  currentTime.value = `${y}/${mt}/${day} ${h}:${m}:${s}`
}

let timer

onMounted(() => {
  // 初始化时间
  updateTime()
  // 设置定时器每秒更新时间
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #000d4a;
  color: #fff;
  font-family: 'Microsoft YaHei';
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.title {
  position: absolute;
  left: 0%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  letter-spacing: 2px;
}

.head {
  height: 60px;
  background: rgba(0, 24, 106, 0.6);
  width: 100%;
}

.head-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0;
}

.head-title {
  font-size: 24px;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  letter-spacing: 2px;
  padding-left: 20px;
}

.head h1 {
  font-size: 24px;
  color: #fff;
}

.mainbox {
  flex: 1;
  padding: 10px;
  overflow: hidden;
  max-height: calc(100vh - 60px);
}

.nav1 {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav1>li {
  padding: 0 5px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.nav1>li>* {
  flex: 1;
  /* 让每个子元素占用相等的空间 */
  margin-bottom: 10px;
  /* 保持组件之间的间距 */
  min-height: calc((100vh - 100px) / 2);
  /* 确保最小高度为容器高度的一半 */
  box-sizing: border-box;
  /* 确保padding和border包含在高度计算中 */
}

.nav1>li>*:last-child {
  margin-bottom: 0;
}

.nav1>li>*:last-child {
  margin-bottom: 0;
  /* 最后一个组件不需要底部间距 */
}

.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

.pulll_left {
  margin: 0;
  letter-spacing: 2px;
}

.head-right {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-right: 20px;
}

.login-btn {
  padding: 6px 15px;
  height: 32px;
  /* 设置相同的高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
