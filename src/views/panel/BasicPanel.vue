<template>
  <div class="basic-panel">
    <el-tabs>
      <el-tab-pane label="电话管理">
        <CommunityPhone />
      </el-tab-pane>
      <el-tab-pane label="轮播图管理">
        <SwitchBanner />
      </el-tab-pane>
      <el-tab-pane label="温馨提示">
        <WarmNotice />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import CommunityPhone from '@/components/adminpanel/CommunityPhone.vue'
import SwitchBanner from '@/components/adminpanel/SwitchBanner.vue'
import WarmNotice from '@/components/adminpanel/WarmNotice.vue'
</script>

<style scoped>
.basic-panel {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}
</style>
