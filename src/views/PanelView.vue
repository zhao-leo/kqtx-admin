<template>
  <div class="panel">
    <!-- 左侧边栏 -->
    <SideBar />

    <!-- 右侧内容区 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
}

:deep(router-view) {
  flex: 1;
  display: flex;
  margin: 20px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
