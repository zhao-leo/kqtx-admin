<template>
  <div class="basic-panel">
    <el-tabs class="custom-tabs">
      <el-tab-pane label="电话管理">
        <transition name="fade-slide">
          <CommunityPhone />
        </transition>
      </el-tab-pane>
      <el-tab-pane label="轮播图管理">
        <transition name="fade-slide">
          <SwitchBanner />
        </transition>
      </el-tab-pane>
      <el-tab-pane label="温馨提示">
        <transition name="fade-slide">
          <WarmNotice />
        </transition>
      </el-tab-pane>
      <el-tab-pane label="动态验证码">
        <transition name="fade-slide">
          <OTPCode />
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import CommunityPhone from '@/components/adminpanel/CommunityPhone.vue'
import SwitchBanner from '@/components/adminpanel/SwitchBanner.vue'
import WarmNotice from '@/components/adminpanel/WarmNotice.vue'
import OTPCode from '@/components/adminpanel/OTPCode.vue'
</script>

<style scoped>
.basic-panel {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.basic-panel:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

:deep(.custom-tabs) {
  background: transparent;
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
  border-bottom: 2px solid #ebeef5;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__item) {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
  background-color: #409eff;
}

:deep(.el-tabs__content) {
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
