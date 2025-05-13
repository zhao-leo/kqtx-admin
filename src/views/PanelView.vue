<template>
  <div class="panel">
    <!-- 左侧边栏 -->
    <SideBar />

    <!-- 右侧内容区 -->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/adminpanel/SideBar.vue'

const route = useRoute()
const currentPanel = ref('basic')

// 监听路由变化以切换面板
watch(
  () => route.path,
  (path) => {
    currentPanel.value = path.split('/').pop() || 'basic'
  },
  { immediate: true }
)
</script>

<style scoped>
.panel {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

router-view {
  flex: 1;
  padding: 20px;
}
</style>
