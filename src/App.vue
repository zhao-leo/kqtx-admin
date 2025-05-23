<template>
  <RouterView />
</template>
<script setup>
import { RouterView } from 'vue-router'
import { onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/token'

const authStore = useAuthStore()

onUnmounted(() => {
  // 清除 token
  authStore.clearToken()
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
