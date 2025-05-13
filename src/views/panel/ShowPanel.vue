<template>
  <div class="show-panel">
    <CommunityShow />
  </div>
</template>

<script setup>
import CommunityShow from '@/components/adminpanel/CommunityShow.vue'
</script>

<style scoped>
.show-panel {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: calc(100vh - 40px);
}
</style>
