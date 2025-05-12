<template>
  <div class="dashboard">
    <div class="head clearfix">
      <h1 class="pulll_left">矿桥东街社区服务数据管理平台</h1>
      <div class="time">{{ currentTime }}</div>
    </div>
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
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background: #000d4a;
  color: #fff;
  font-family: 'Microsoft YaHei';
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.head {
  height: 60px;
  background: rgba(0, 24, 106, 0.6);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head h1 {
  font-size: 24px;
  color: #fff;
}

.time {
  font-size: 16px;
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
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.nav1>li>* {
  flex: 1;
  margin-bottom: 10px;
}

.nav1>li>*:last-child {
  margin-bottom: 0;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.pulll_left {
  margin: 0;
  letter-spacing: 2px;
}
</style>
